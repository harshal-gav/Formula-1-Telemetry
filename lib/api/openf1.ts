import {
  OpenF1CarData,
  OpenF1Interval,
  OpenF1Lap,
  OpenF1Position,
  OpenF1Session,
  OpenF1Stint,
  OpenF1Weather,
} from "./types";

const OPENF1_BASE_URL = "https://api.openf1.org/v1";

// Simple client-side rate throttle queue (ensures maximum 2 req/second)
let lastRequestTimestamp = 0;
const MIN_REQUEST_INTERVAL_MS = 600; // at least 600ms between network calls to safely avoid 3 req/sec cap

async function throttledFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTimestamp;
  if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
    const delay = MIN_REQUEST_INTERVAL_MS - timeSinceLast;
    await new Promise((r) => setTimeout(r, delay));
  }
  lastRequestTimestamp = Date.now();
  return fetch(url);
}

function getCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`openf1_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(`openf1_cache_${key}`);
      return null;
    }
    return parsed.data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T, ttlMinutes = 60) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      data,
      expiry: Date.now() + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(`openf1_cache_${key}`, JSON.stringify(payload));
  } catch (err) {
    console.warn("OpenF1 cache write failed:", err);
  }
}

async function fetchOpenF1<T>(endpoint: string, ttlMinutes = 60): Promise<T> {
  const cacheKey = endpoint.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 100);
  const cached = getCache<T>(cacheKey);
  if (cached) return cached;

  const url = `${OPENF1_BASE_URL}${endpoint}`;
  try {
    const res = await throttledFetch(url);
    if (res.status === 429) {
      console.warn("OpenF1 Rate limit reached (429). Falling back to cached data if available.");
      const fallback = getCache<T>(cacheKey);
      if (fallback) return fallback;
      throw new Error("OpenF1 rate limit exceeded. Please wait a few moments before refreshing.");
    }
    if (!res.ok) {
      throw new Error(`OpenF1 error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as T;
    setCache(cacheKey, data, ttlMinutes);
    return data;
  } catch (err) {
    const fallback = getCache<T>(cacheKey);
    if (fallback) return fallback;
    throw err;
  }
}

export const openf1 = {
  /**
   * Get sessions by year (and optionally meeting or type)
   */
  async getSessions(year: number = 2024): Promise<OpenF1Session[]> {
    return fetchOpenF1<OpenF1Session[]>(`/sessions?year=${year}`, 30);
  },

  /**
   * Get latest session
   */
  async getLatestSession(): Promise<OpenF1Session | null> {
    const sessions = await fetchOpenF1<OpenF1Session[]>(`/sessions?session_name=Race&year=2024`, 30);
    return sessions.length > 0 ? sessions[sessions.length - 1] : null;
  },

  /**
   * Get car data (speed, rpm, throttle, brake, gear) for a driver in a session
   */
  async getCarData(sessionKey: number, driverNumber: number): Promise<OpenF1CarData[]> {
    return fetchOpenF1<OpenF1CarData[]>(
      `/car_data?session_key=${sessionKey}&driver_number=${driverNumber}`,
      120
    );
  },

  /**
   * Get lap times and sector times for a session
   */
  async getLaps(sessionKey: number, driverNumber?: number): Promise<OpenF1Lap[]> {
    const query = driverNumber
      ? `/laps?session_key=${sessionKey}&driver_number=${driverNumber}`
      : `/laps?session_key=${sessionKey}`;
    return fetchOpenF1<OpenF1Lap[]>(query, 60);
  },

  /**
   * Get tyre stints for all drivers or a specific driver in a session
   */
  async getStints(sessionKey: number, driverNumber?: number): Promise<OpenF1Stint[]> {
    const query = driverNumber
      ? `/stints?session_key=${sessionKey}&driver_number=${driverNumber}`
      : `/stints?session_key=${sessionKey}`;
    return fetchOpenF1<OpenF1Stint[]>(query, 60);
  },

  /**
   * Get driver intervals / gaps to leader
   */
  async getIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
    return fetchOpenF1<OpenF1Interval[]>(`/intervals?session_key=${sessionKey}`, 30);
  },

  /**
   * Get driver positions during a session
   */
  async getPositions(sessionKey: number): Promise<OpenF1Position[]> {
    return fetchOpenF1<OpenF1Position[]>(`/position?session_key=${sessionKey}`, 30);
  },

  /**
   * Get track weather data (track temp, air temp, rain)
   */
  async getWeather(sessionKey: number): Promise<OpenF1Weather[]> {
    return fetchOpenF1<OpenF1Weather[]>(`/weather?session_key=${sessionKey}`, 30);
  },
};
