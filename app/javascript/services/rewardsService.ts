import type { Reward } from "@/types/reward-hub";
import { parseJson } from "@/services/http";

export async function fetchRewards(): Promise<{ rewards: Reward[] }> {
  const res = await fetch("/rewards", { headers: { Accept: "application/json" } });
  return parseJson(res);
}
