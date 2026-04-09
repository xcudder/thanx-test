import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, History } from "lucide-react";
import type { Redemption } from "@/lib/rewards-data";

interface RedemptionHistoryProps {
  history: Redemption[];
}

const RedemptionHistory = ({ history }: RedemptionHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="redemption-history__empty">
        <History className="redemption-history__empty-icon" aria-hidden />
        <p className="redemption-history__empty-text">No redemptions yet. Browse rewards to get started!</p>
      </div>
    );
  }

  return (
    <div className="redemption-history__list">
      <AnimatePresence>
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="redemption-history__item"
          >
            <div className="redemption-history__icon-wrap">
              <CheckCircle2 className="redemption-history__icon" aria-hidden />
            </div>
            <div className="redemption-history__main">
              <p className="redemption-history__title">{item.rewardName}</p>
              <p className="redemption-history__meta">
                {item.redeemedAt.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className="redemption-history__cost">−{item.cost.toLocaleString()} pts</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RedemptionHistory;
