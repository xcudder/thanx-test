/**
 * Shapes aligned with the Thanx JSON API (and small UI-only additions).
 */

export type RewardHubPanel = "browse" | "history";

export interface Reward {
  id: number;
  name: string;
  description: string;
  photo: string | null;
  stock: number;
  point_cost: number;
  active: boolean;
}

/** One row from `GET /users/:id/redemption_history`. */
export interface Redemption {
  id: number;
  reward_id: number;
  reward_name: string;
  points_spent: number;
  created_at: string;
}

export interface ApiUser {
  id: number;
  name: string;
}

/** Header user selector (string id for `<select>` values). */
export interface UserOption {
  id: string;
  name: string;
  avatar: string;
}

export interface FlashPayload {
  title: string;
  description?: string;
  variant: "info" | "error";
}

export interface FlashMessageProps {
  flash: FlashPayload | null;
  onDismiss: () => void;
}

export interface RedeemDialogProps {
  reward: Reward | null;
  open: boolean;
  isSubmitting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
