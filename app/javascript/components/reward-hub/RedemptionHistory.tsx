import type { Redemption } from "@/types/reward-hub";

interface RedemptionHistoryProps {
  history: Redemption[];
}

const RedemptionHistory = ({ history }: RedemptionHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="redemption-history__empty">
        <span className="redemption-history__empty-icon" aria-hidden>
          ◷
        </span>
        <p className="redemption-history__empty-text">No redemptions yet. Browse rewards to get started!</p>
      </div>
    );
  }

  return (
    <ul className="redemption-history__list">
      {history.map((item) => (
        <li key={item.id} className="redemption-history__item">
          <div className="redemption-history__icon-wrap">
            <span className="redemption-history__icon" aria-hidden>
              ✓
            </span>
          </div>
          <div className="redemption-history__main">
            <p className="redemption-history__title">{item.reward_name}</p>
            <p className="redemption-history__meta">
              {new Date(item.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span className="redemption-history__cost">−{item.points_spent.toLocaleString()} pts</span>
        </li>
      ))}
    </ul>
  );
};

export default RedemptionHistory;
