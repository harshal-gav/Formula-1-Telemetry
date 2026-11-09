"use client";

import { useQuery } from "@tanstack/react-query";
import { openf1 } from "@/lib/api/openf1";

export function useOpenF1Sessions(year: number = 2024) {
  return useQuery({
    queryKey: ["openf1", "sessions", year],
    queryFn: () => openf1.getSessions(year),
    staleTime: 1000 * 60 * 30,
  });
}

export function useOpenF1CarData(sessionKey: number, driverNumber: number, enabled = true) {
  return useQuery({
    queryKey: ["openf1", "carData", sessionKey, driverNumber],
    queryFn: () => openf1.getCarData(sessionKey, driverNumber),
    enabled: enabled && sessionKey > 0 && driverNumber > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useOpenF1Laps(sessionKey: number, driverNumber?: number, enabled = true) {
  return useQuery({
    queryKey: ["openf1", "laps", sessionKey, driverNumber],
    queryFn: () => openf1.getLaps(sessionKey, driverNumber),
    enabled: enabled && sessionKey > 0,
    staleTime: 1000 * 60 * 45,
  });
}

export function useOpenF1Stints(sessionKey: number, driverNumber?: number, enabled = true) {
  return useQuery({
    queryKey: ["openf1", "stints", sessionKey, driverNumber],
    queryFn: () => openf1.getStints(sessionKey, driverNumber),
    enabled: enabled && sessionKey > 0,
    staleTime: 1000 * 60 * 45,
  });
}

export function useOpenF1Intervals(sessionKey: number, enabled = true) {
  return useQuery({
    queryKey: ["openf1", "intervals", sessionKey],
    queryFn: () => openf1.getIntervals(sessionKey),
    enabled: enabled && sessionKey > 0,
    staleTime: 1000 * 60 * 15,
  });
}

export function useOpenF1Weather(sessionKey: number, enabled = true) {
  return useQuery({
    queryKey: ["openf1", "weather", sessionKey],
    queryFn: () => openf1.getWeather(sessionKey),
    enabled: enabled && sessionKey > 0,
    staleTime: 1000 * 60 * 20,
  });
}

