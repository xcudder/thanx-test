import { parseJson } from "@/services/http";

export type RewardDto = {
  id: number;
  name: string;
  description: string;
  photo: string | null;
  stock: number;
  point_cost: number;
  active: boolean;
};

export async function fetchRewards(): Promise<{ rewards: RewardDto[] }> {
  const res = await fetch("/rewards", { headers: { Accept: "application/json" } });
  return parseJson(res);
}
