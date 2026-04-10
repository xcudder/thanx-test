import type { Reward, UserOption } from "@/types/reward-hub";
import { fetchUsers } from "@/services/usersService";
import { fetchRewards } from "@/services/rewardsService";
import { userOptionsFromApiUsers } from "@/lib/rewardHub/userOptionsFromApi";

export type RewardHubBootPayload = {
  userOptions: UserOption[];
  rewards: Reward[];
  activeUserId: string;
};

/** Loads users + rewards once for initial paint (parallel requests). */
export async function fetchRewardHubBootPayload(): Promise<RewardHubBootPayload> {
  const [apiUsers, rewardsRes] = await Promise.all([fetchUsers(), fetchRewards()]);
  return {
    userOptions: userOptionsFromApiUsers(apiUsers),
    rewards: rewardsRes.rewards,
    activeUserId: apiUsers[0] ? String(apiUsers[0].id) : "",
  };
}

export type InitialRewardHubBootstrapOutcome =
  | { status: "success"; payload: RewardHubBootPayload }
  | { status: "failed" }
  | { status: "cancelled" };

/**
 * Runs once at mount: parallel users + rewards fetch.
 * Returns `cancelled` if the caller’s abort flag flipped before applying results.
 */
export async function runInitialRewardHubBootstrap(
  isCancelled: () => boolean,
): Promise<InitialRewardHubBootstrapOutcome> {
  try {
    const payload = await fetchRewardHubBootPayload();
    if (isCancelled()) return { status: "cancelled" };
    return { status: "success", payload };
  } catch {
    if (isCancelled()) return { status: "cancelled" };
    return { status: "failed" };
  }
}
