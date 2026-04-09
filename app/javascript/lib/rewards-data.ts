/**
 * UI-facing shapes for Reward Hub components (filled from Thanx JSON API via services).
 */
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  image: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  redeemedAt: Date;
}

/** Minimal user row for the header selector (id is string for Radix Select values). */
export interface UserOption {
  id: string;
  name: string;
  avatar: string;
}
