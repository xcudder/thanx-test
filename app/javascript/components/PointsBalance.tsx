import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PointsBalanceProps {
  points: number;
  animateKey?: number;
}

const PointsBalance = ({ points, animateKey }: PointsBalanceProps) => (
  <div className="points-balance">
    <div className="points-balance__glow" aria-hidden />
    <div className="points-balance__body">
      <div className="points-balance__label-row">
        <Sparkles className="points-balance__icon" aria-hidden />
        <span className="points-balance__label">Your Balance</span>
      </div>
      <motion.div
        key={animateKey}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.35 }}
        className="points-balance__amount-row"
      >
        <span className="points-balance__amount">{points.toLocaleString()}</span>
        <span className="points-balance__suffix">pts</span>
      </motion.div>
    </div>
  </div>
);

export default PointsBalance;
