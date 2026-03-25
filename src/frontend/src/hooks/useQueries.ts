import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ScoreEntryInput } from "../backend.d";
import { useActor } from "./useActor";

export function useGlobalTop10() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", "global"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGlobalTop10();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useTop10ByAgeGroup(ageGroup: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", ageGroup],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTop10ByAgeGroup(ageGroup);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ScoreEntryInput) => {
      if (!actor) throw new Error("No actor available");
      return actor.submitScore(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
