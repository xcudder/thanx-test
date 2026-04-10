import { useCallback, useState } from "react";
import type { UseRewardHubRedeemParams, UseRewardHubRedeemReturn } from "@/types/reward-hub-context";
import type { Reward } from "@/types/reward-hub";
import { ApiError } from "@/services/http";
import { redeemReward } from "@/services/redemptionsService";
import {
  applyWalletCatalogRefresh,
  loadWalletAndRewardsAfterRedeem,
} from "@/lib/rewardHub/walletCatalog";
import { redeemRejectionCodeFrom422Body } from "@/lib/rewardHub/redeemApiErrors";
import {
  flashPayloadRedeemPointsSpent,
  flashPayloadRedeemRejected,
  flashPayloadRedeemUnexpectedError,
} from "@/lib/rewardHub/flashPayloads";

/**
 * Owns redeem UI state (selection + submitting) and wires POST + server refresh into parent setters.
 * Parent context keeps wallet/catalog/flash buckets; this hook composes the redeem slice only.
 */
export function useRewardHubRedeem({
  activeUserId,
  userOptions,
  setPoints,
  setHistory,
  setRewards,
  setFlash,
}: UseRewardHubRedeemParams): UseRewardHubRedeemReturn {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);

  const clearSelectedReward = useCallback(() => {
    setSelectedReward(null);
  }, []);

  const handleCancelRedeem = useCallback(() => {
    if (!redeemSubmitting) clearSelectedReward();
  }, [redeemSubmitting, clearSelectedReward]);

  const handleRedeem = useCallback(async () => {
    if (!selectedReward) return;
    const uid = Number(activeUserId);
    const userDisplayName = userOptions.find((u) => u.id === activeUserId)?.name ?? "User";

    setRedeemSubmitting(true);
    try {
      await redeemReward(uid, selectedReward.id);
      const refreshed = await loadWalletAndRewardsAfterRedeem(uid);
      applyWalletCatalogRefresh(refreshed, { setPoints, setHistory, setRewards });

      setFlash(flashPayloadRedeemPointsSpent(selectedReward, userDisplayName));
      clearSelectedReward();
    } catch (e) {
      const isUnprocessableRedeem = e instanceof ApiError && e.status === 422;
      const redeemRejectionCode = isUnprocessableRedeem ? redeemRejectionCodeFrom422Body(e.body) : undefined;

      if (isUnprocessableRedeem) {
        setFlash(flashPayloadRedeemRejected(redeemRejectionCode));
      } else {
        setFlash(flashPayloadRedeemUnexpectedError());
      }
    } finally {
      setRedeemSubmitting(false);
    }
  }, [
    selectedReward,
    activeUserId,
    userOptions,
    setPoints,
    setHistory,
    setRewards,
    setFlash,
    clearSelectedReward,
  ]);

  return {
    selectedReward,
    setSelectedReward,
    redeemSubmitting,
    handleRedeem,
    handleCancelRedeem,
  };
}
