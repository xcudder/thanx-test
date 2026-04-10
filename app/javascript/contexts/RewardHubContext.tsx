import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { FlashPayload, Redemption, Reward, RewardHubPanel, UserOption } from "@/types/reward-hub";
import type { RewardHubContextValue } from "@/types/reward-hub-context";
import { runInitialRewardHubBootstrap } from "@/lib/rewardHub/boot";
import { flashPayloadBootLoadFailed, flashPayloadUserWalletLoadFailed } from "@/lib/rewardHub/flashPayloads";
import { loadUserWalletFromServer } from "@/lib/rewardHub/walletCatalog";
import { useRewardHubRedeem } from "@/lib/rewardHub/useRewardHubRedeem";

const RewardHubContext = createContext<RewardHubContextValue | null>(null);

export function RewardHubProvider({ children }: { children: ReactNode }) {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<Redemption[]>([]);
  const [bootLoading, setBootLoading] = useState(true);
  const [panel, setPanel] = useState<RewardHubPanel>("browse");
  const [flash, setFlash] = useState<FlashPayload | null>(null);

  const dismissFlash = useCallback(() => setFlash(null), []);

  // Runs once when the provider mounts: load user list + rewards catalog, pick first user, clear boot spinner.
  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;

    void (async () => {
      const outcome = await runInitialRewardHubBootstrap(isCancelled);
      if (outcome.status === "success") {
        setUserOptions(outcome.payload.userOptions);
        setRewards(outcome.payload.rewards);
        setActiveUserId(outcome.payload.activeUserId);
      } else if (outcome.status === "failed") {
        setFlash(flashPayloadBootLoadFailed());
      }
      if (!isCancelled()) setBootLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Runs whenever `activeUserId` changes: after bootstrap sets the first user, and whenever the header selector picks another user.
  // Skips while `activeUserId` is still "" (before bootstrap finishes or if there are no users).
  useEffect(() => {
    if (!activeUserId) return;
    let cancelled = false;

    void (async () => {
      const uid = Number(activeUserId);
      try {
        const wallet = await loadUserWalletFromServer(uid);
        if (cancelled) return;
        setPoints(wallet.points);
        setHistory(wallet.history);
      } catch {
        if (!cancelled) setFlash(flashPayloadUserWalletLoadFailed());
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  const {
    selectedReward,
    setSelectedReward,
    redeemSubmitting,
    handleRedeem,
    handleCancelRedeem,
  } = useRewardHubRedeem({
    activeUserId,
    userOptions,
    setPoints,
    setHistory,
    setRewards,
    setFlash,
  });

  const value: RewardHubContextValue = {
    userOptions,
    activeUserId,
    setActiveUserId,
    rewards,
    points,
    history,
    bootLoading,
    panel,
    setPanel,
    selectedReward,
    setSelectedReward,
    redeemSubmitting,
    flash,
    dismissFlash,
    handleRedeem,
    handleCancelRedeem,
  };

  return <RewardHubContext.Provider value={value}>{children}</RewardHubContext.Provider>;
}

export function useRewardHub(): RewardHubContextValue {
  const ctx = useContext(RewardHubContext);
  if (!ctx) {
    throw new Error("useRewardHub must be used within RewardHubProvider");
  }
  return ctx;
}
