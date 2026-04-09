import type { Redemption, Reward } from "@/lib/rewards-data";
import type { RedemptionHistoryRow } from "@/services/usersService";
import type { RewardDto } from "@/services/rewardsService";

const REWARD_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80";

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function mapRewardDto(dto: RewardDto): Reward {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description,
    cost: dto.point_cost,
    category: "Rewards",
    image: dto.photo ?? REWARD_IMAGE_FALLBACK,
  };
}

export function mapHistoryRow(row: RedemptionHistoryRow): Redemption {
  return {
    id: String(row.id),
    rewardId: String(row.reward_id),
    rewardName: row.reward_name,
    cost: row.points_spent,
    redeemedAt: new Date(row.created_at),
  };
}
