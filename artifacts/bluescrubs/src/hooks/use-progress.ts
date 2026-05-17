import { useQuery } from "@tanstack/react-query";
import type { UserStats, Achievement } from "@/lib/types";

export function useUserStats(userId: number) {
  return useQuery<UserStats>({
    queryKey: [`/api/users/${userId}/stats`],
    enabled: !!userId,
  });
}

export function useUserProgress(userId: number, limit?: number) {
  return useQuery({
    queryKey: [`/api/users/${userId}/progress`, { limit }],
    enabled: !!userId,
  });
}

export function useUserAchievements(userId: number) {
  return useQuery<Achievement[]>({
    queryKey: [`/api/users/${userId}/achievements`],
    enabled: !!userId,
  });
}
