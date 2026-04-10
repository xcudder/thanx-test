import type { Reward } from "@/lib/rewards-data";

interface RewardCardProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: (reward: Reward) => void;
}

const RewardCard = ({ reward, canAfford, onRedeem }: RewardCardProps) => (
  <article className="reward-card">
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
        <button
          type="button"
          className="rh-btn rh-btn--primary rh-btn--sm"
          disabled={!canAfford}
          onClick={() => onRedeem(reward)}
        >
          Redeem
        </button>
      </div>
    </div>
  </article>
);

export default RewardCard;
