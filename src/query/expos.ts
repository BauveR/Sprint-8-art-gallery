import { useQuery } from "@tanstack/react-query";
import { exposService } from "../services/expoService";
import { Expo } from "../types";

export const exposKeys = { all: ["expos"] as const };

export function useExpos() {
  return useQuery<Expo[]>({
    queryKey: exposKeys.all,
    queryFn: exposService.list,
  });
}
