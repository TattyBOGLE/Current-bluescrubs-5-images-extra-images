import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UserStats, Achievement } from "@/lib/types";
import type { InsertUserProgress } from "@shared/schema";

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

export function useProgress(userId: number = 1) {
  const queryClient = useQueryClient();

  const saveProgress = useMutation({
    mutationFn: async (data: InsertUserProgress) => {
      const response = await apiRequest('POST', '/api/progress', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/progress`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/stats`] });
    },
  });

  return { saveProgress };
}
