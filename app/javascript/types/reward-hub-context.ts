import type { Dispatch, SetStateAction } from "react";
import type {
  FlashPayload,
  Redemption,
  Reward,
  RewardHubPanel,
  UserOption,
} from "@/types/reward-hub";

/** Setters for state the redeem flow refreshes from the server (context still owns the data). */
export type UseRewardHubRedeemParams = {
  activeUserId: string;
  userOptions: UserOption[];
  setPoints: Dispatch<SetStateAction<number>>;
  setHistory: Dispatch<SetStateAction<Redemption[]>>;
  setRewards: Dispatch<SetStateAction<Reward[]>>;
  setFlash: Dispatch<SetStateAction<FlashPayload | null>>;
};

export type UseRewardHubRedeemReturn = {
  selectedReward: Reward | null;
  setSelectedReward: Dispatch<SetStateAction<Reward | null>>;
  redeemSubmitting: boolean;
  handleRedeem: () => Promise<void>;
  handleCancelRedeem: () => void;
};

export type RewardHubContextValue = {
  userOptions: UserOption[];
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  rewards: Reward[];
  points: number;
  history: Redemption[];
  bootLoading: boolean;
  panel: RewardHubPanel;
  setPanel: (p: RewardHubPanel) => void;
  selectedReward: Reward | null;
  setSelectedReward: (r: Reward | null) => void;
  redeemSubmitting: boolean;
  flash: FlashPayload | null;
  dismissFlash: () => void;
  handleRedeem: () => Promise<void>;
  handleCancelRedeem: () => void;
};
