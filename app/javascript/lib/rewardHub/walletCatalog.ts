import type { Dispatch, SetStateAction } from "react";
import type { Redemption, Reward } from "@/types/reward-hub";
import { fetchBalance, fetchRedemptionHistory } from "@/services/usersService";
import { fetchRewards } from "@/services/rewardsService";

export type WalletCatalogRefreshSnapshot = {
  points: number;
  history: Redemption[];
  rewards: Reward[];
};

export type WalletCatalogRefreshSetters = {
  setPoints: Dispatch<SetStateAction<number>>;
  setHistory: Dispatch<SetStateAction<Redemption[]>>;
  setRewards: Dispatch<SetStateAction<Reward[]>>;
};

/** Pushes a post-fetch snapshot into React state (one readable call site). */
export function applyWalletCatalogRefresh(
  snapshot: WalletCatalogRefreshSnapshot,
  { setPoints, setHistory, setRewards }: WalletCatalogRefreshSetters,
): void {
  setPoints(snapshot.points);
  setHistory(snapshot.history);
  setRewards(snapshot.rewards);
}

/** Balance + history for the active user (e.g. after switching user). */
export async function loadUserWalletFromServer(userId: number): Promise<{
  points: number;
  history: Redemption[];
}> {
  const [bal, hist] = await Promise.all([fetchBalance(userId), fetchRedemptionHistory(userId)]);
  return { points: bal.point_balance, history: hist.redemptions };
}

/** Refreshes everything that can change after a redeem: wallet, history, and global rewards list. */
export async function loadWalletAndRewardsAfterRedeem(userId: number): Promise<WalletCatalogRefreshSnapshot> {
  const [bal, hist, rewardsRes] = await Promise.all([
    fetchBalance(userId),
    fetchRedemptionHistory(userId),
    fetchRewards(),
  ]);
  return {
    points: bal.point_balance,
    history: hist.redemptions,
    rewards: rewardsRes.rewards,
  };
}
