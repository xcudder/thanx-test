import { parseJson } from "@/services/http";

export type RedeemResponse = {
  redemption: {
    id: number;
    user_id: number;
    reward_id: number;
    points_spent: number;
    created_at: string;
  };
  point_balance: number;
};

export async function redeemReward(userId: number, rewardId: number): Promise<RedeemResponse> {
  const res = await fetch("/redeem", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId, reward_id: rewardId }),
  });
  return parseJson<RedeemResponse>(res);
}
