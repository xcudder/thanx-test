import type { FlashPayload, Reward } from "@/types/reward-hub";
import { userMessageForRedeemRejectionCode } from "@/lib/rewardHub/redeemApiErrors";

export function flashPayloadBootLoadFailed(): FlashPayload {
  return {
    variant: "error",
    title: "Could not load rewards",
    description: "Check that the Rails server is running and the database is seeded.",
  };
}

export function flashPayloadUserWalletLoadFailed(): FlashPayload {
  return { variant: "error", title: "Could not load user" };
}

/** Shown after a successful redeem — points deducted from the selected user. */
export function flashPayloadRedeemPointsSpent(reward: Reward, userDisplayName: string): FlashPayload {
  return {
    variant: "info",
    title: `${reward.name} redeemed!`,
    description: `${reward.point_cost.toLocaleString()} points deducted from ${userDisplayName}.`,
  };
}

export function flashPayloadRedeemRejected(rejectionCode: string | undefined): FlashPayload {
  return {
    variant: "error",
    title: "Could not redeem",
    description: userMessageForRedeemRejectionCode(rejectionCode),
  };
}

export function flashPayloadRedeemUnexpectedError(): FlashPayload {
  return {
    variant: "error",
    title: "Could not redeem",
    description: "Something went wrong. Try again.",
  };
}
