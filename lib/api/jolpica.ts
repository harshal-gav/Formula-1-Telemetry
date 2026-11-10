import {
  ConstructorStanding,
  Driver,
  DriverStanding,
  JolpicaMRData,
  PitStop,
  QualifyingResult,
  Race,
  RaceLap,
  RaceResult,
} from "./types";

const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1";

// Cache helper using localStorage with TTL
function getLocalStorageCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(`jolpica_cache_${key}`);
    if (!item) return null;
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(`jolpica_cache_${key}`);
      return null;
    }
    return parsed.data as T;
  } catch {
    return null;
  }
}

function setLocalStorageCache<T>(key: string, data: T, ttlMinutes = 30) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      data,
      expiry: Date.now() + ttlMinutes * 60 * 1000,
    };
    localStorage.setItem(`jolpica_cache_${key}`, JSON.stringify(payload));
  } catch (err) {
    console.warn("Local storage cache write failed:", err);
  }
}

async function fetchJolpica<T>(endpoint: string, ttlMinutes = 30): Promise<T> {
  const cacheKey = endpoint.replace(/[^a-zA-Z0-9]/g, "_");
  const cached = getLocalStorageCache<T>(cacheKey);
  if (cached) return cached;

  const url = `${JOLPICA_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Timing feed error: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as T;
    setLocalStorageCache(cacheKey, data, ttlMinutes);
    return data;
  } catch (err) {
    // If request fails, return cached even if expired as fallback
    if (typeof window !== "undefined") {
      try {
        const fallback = localStorage.getItem(`jolpica_cache_${cacheKey}`);
        if (fallback) {
          return JSON.parse(fallback).data as T;
        }
      } catch {}
    }
    throw err;
  }
}

export const jolpica = {
  /**
   * Get all races for a season (defaults to 'current')
   */
  async getRaces(season: string = "current"): Promise<Race[]> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}.json`, 60);
    return res.MRData.RaceTable?.Races || [];
  },

  /**
   * Get race results for a round
   */
  async getRaceResults(season: string = "current", round: string = "last"): Promise<Race | null> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/${round}/results.json`, 15);
    return res.MRData.RaceTable?.Races[0] || null;
  },

  /**
   * Get qualifying results for a round
   */
  async getQualifyingResults(season: string = "current", round: string = "last"): Promise<Race | null> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/${round}/qualifying.json`, 15);
    return res.MRData.RaceTable?.Races[0] || null;
  },

  /**
   * Get driver championship standings
   */
  async getDriverStandings(season: string = "current"): Promise<DriverStanding[]> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/driverStandings.json`, 15);
    return res.MRData.StandingsTable?.StandingsLists[0]?.DriverStandings || [];
  },

  /**
   * Get constructor championship standings
   */
  async getConstructorStandings(season: string = "current"): Promise<ConstructorStanding[]> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/constructorStandings.json`, 15);
    return res.MRData.StandingsTable?.StandingsLists[0]?.ConstructorStandings || [];
  },

  /**
   * Get pit stops for a round
   */
  async getPitStops(season: string = "current", round: string = "last"): Promise<PitStop[]> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/${round}/pitstops.json?limit=100`, 30);
    return res.MRData.RaceTable?.Races[0]?.PitStops || [];
  },

  /**
   * Get laps for a round
   */
  async getLaps(season: string = "current", round: string = "last", lapNumber?: number): Promise<RaceLap[]> {
    const endpoint = lapNumber
      ? `/${season}/${round}/laps/${lapNumber}.json?limit=100`
      : `/${season}/${round}/laps.json?limit=2000`;
    const res = await fetchJolpica<JolpicaMRData<any>>(endpoint, 30);
    return res.MRData.RaceTable?.Races[0]?.Laps || [];
  },

  /**
   * Get driver roster for a season
   */
  async getDrivers(season: string = "current"): Promise<Driver[]> {
    const res = await fetchJolpica<JolpicaMRData<any>>(`/${season}/drivers.json?limit=100`, 60);
    return res.MRData.DriverTable?.Drivers || [];
  },
};

