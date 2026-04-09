import { motion } from "framer-motion";
import { Button } from "@/components/lovable-ui/button";
import type { Reward } from "@/lib/rewards-data";
import { cx } from "@/lib/utils";

interface RewardCardProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: (reward: Reward) => void;
}

const RewardCard = ({ reward, canAfford, onRedeem }: RewardCardProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="reward-card"
  >
    <div className="reward-card__media">
      <img src={reward.image} alt={reward.name} loading="lazy" className="reward-card__img" />
    </div>
    <div className="reward-card__body">
      <div className="reward-card__text">
        <h3 className="reward-card__name">{reward.name}</h3>
        <p className="reward-card__desc">{reward.description}</p>
      </div>
      <div className="reward-card__footer">
        <span className="reward-card__cost">{reward.cost.toLocaleString()} pts</span>
        <Button
          size="sm"
          disabled={!canAfford}
          onClick={() => onRedeem(reward)}
          className={cx("ui-button--pill", "ui-button--reward-redeem")}
        >
          Redeem
        </Button>
      </div>
    </div>
  </motion.div>
);

export default RewardCard;
