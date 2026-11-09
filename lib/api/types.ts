/**
 * Domain Types for Jolpica F1 API (Ergast compatible) & OpenF1 API
 */

// ==========================================
// 1. Jolpica F1 API Types
// ==========================================

export interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

export interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
}

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code?: string;
  url?: string;
  givenName: string;
  familyName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface Constructor {
  constructorId: string;
  url?: string;
  name: string;
  nationality?: string;
}

export interface LapTime {
  millis?: string;
  time: string;
}

export interface FastestLap {
  rank: string;
  lap: string;
  Time: LapTime;
  AverageSpeed?: {
    units: string;
    speed: string;
  };
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: LapTime;
  FastestLap?: FastestLap;
}

export interface QualifyingResult {
  number: string;
  position: string;
  Driver: Driver;
  Constructor: Constructor;
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export interface PitStop {
  driverId: string;
  lap: string;
  stop: string;
  time: string;
  duration: string;
}

export interface RaceLapTiming {
  driverId: string;
  position: string;
  time: string;
}

export interface RaceLap {
  number: string;
  Timings: RaceLapTiming[];
}

export interface Race {
  season: string;
  round: string;
  url?: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time?: string;
  Results?: RaceResult[];
  QualifyingResults?: QualifyingResult[];
  PitStops?: PitStop[];
  Laps?: RaceLap[];
  FirstPractice?: { date: string; time?: string };
  SecondPractice?: { date: string; time?: string };
  ThirdPractice?: { date: string; time?: string };
  Qualifying?: { date: string; time?: string };
  Sprint?: { date: string; time?: string };
}

export interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

export interface ConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: Constructor;
}

export interface JolpicaMRData<T> {
  MRData: {
    xmlns?: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable?: {
      season?: string;
      round?: string;
      Races: Race[];
    };
    StandingsTable?: {
      season: string;
      StandingsLists: Array<{
        season: string;
        round: string;
        DriverStandings?: DriverStanding[];
        ConstructorStandings?: ConstructorStanding[];
      }>;
    };
    DriverTable?: {
      season?: string;
      Drivers: Driver[];
    };
  } & T;
}

// ==========================================
// 2. OpenF1 API Types
// ==========================================

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_key: number;
  circuit_short_name: string;
  country_name: string;
  country_code: string;
  location: string;
  year: number;
  gmt_offset: string;
  is_cancelled?: boolean;
}

export interface OpenF1CarData {
  brake: number; // 0 or 100
  date: string;
  driver_number: number;
  drs: number; // 0, 1, 10, 12, 14
  meeting_key: number;
  n_gear: number; // 0 to 8
  rpm: number;
  session_key: number;
  speed: number; // km/h
  throttle: number; // 0 to 100
}

export interface OpenF1Lap {
  date_start: string;
  driver_number: number;
  duration_sector_1?: number;
  duration_sector_2?: number;
  duration_sector_3?: number;
  i1_speed?: number;
  i2_speed?: number;
  is_pit_out_lap: boolean;
  lap_duration?: number;
  lap_number: number;
  meeting_key: number;
  session_key: number;
  st_speed?: number;
}

export interface OpenF1Stint {
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" | string;
  driver_number: number;
  lap_end: number;
  lap_start: number;
  meeting_key: number;
  session_key: number;
  stint_number: number;
  tyre_age_at_start: number;
}

export interface OpenF1Interval {
  date: string;
  driver_number: number;
  gap_to_leader?: number | string | null;
  interval?: number | string | null;
  meeting_key: number;
  session_key: number;
}

export interface OpenF1Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface OpenF1Weather {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

// ==========================================
// 3. User & Subscription State Types
// ==========================================

export type SubscriptionPlan = "free" | "pro";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "on_hold" | "trialing";

export interface UserSubscription {
  uid: string;
  email: string | null;
  displayName?: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  subscriptionId?: string | null;
  customerId?: string | null;
  currentPeriodEnd?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
