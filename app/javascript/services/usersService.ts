import { parseJson } from "@/services/http";

export type ApiUser = { id: number; name: string };

export async function fetchUsers(): Promise<ApiUser[]> {
  const res = await fetch("/users", { headers: { Accept: "application/json" } });
  const data = await parseJson<{ users: ApiUser[] }>(res);
  return data.users;
}

export async function fetchBalance(userId: number): Promise<{ user_id: number; point_balance: number }> {
  const res = await fetch(`/users/${userId}/balance`, { headers: { Accept: "application/json" } });
  return parseJson(res);
}

export type RedemptionHistoryRow = {
  id: number;
  reward_id: number;
  reward_name: string;
  points_spent: number;
  created_at: string;
};

export async function fetchRedemptionHistory(userId: number): Promise<{ redemptions: RedemptionHistoryRow[] }> {
  const res = await fetch(`/users/${userId}/redemption_history`, { headers: { Accept: "application/json" } });
  return parseJson(res);
}
