interface PointsBalanceProps {
  points: number;
}

const PointsBalance = ({ points }: PointsBalanceProps) => (
  <div className="points-balance">
    <div className="points-balance__glow" aria-hidden />
    <div className="points-balance__body">
      <div className="points-balance__label-row">
        <span className="points-balance__icon" aria-hidden>
          ✦
        </span>
        <span className="points-balance__label">Your Balance</span>
      </div>
      <div className="points-balance__amount-row">
        <span className="points-balance__amount">{points.toLocaleString()}</span>
        <span className="points-balance__suffix">pts</span>
      </div>
    </div>
  </div>
);

export default PointsBalance;
