import { RewardHubProvider, useRewardHub } from "@/contexts/RewardHubContext";
import PointsBalance from "@/components/reward-hub/PointsBalance";
import RewardCard from "@/components/reward-hub/RewardCard";
import RedeemDialog from "@/components/reward-hub/RedeemDialog";
import RedemptionHistory from "@/components/reward-hub/RedemptionHistory";
import RewardHubTabs from "@/components/reward-hub/RewardHubTabs";
import RewardHubToolbar from "@/components/reward-hub/RewardHubToolbar";
import FlashMessage from "@/components/reward-hub/FlashMessage";

function RewardHubPage() {
  const {
    userOptions,
    activeUserId,
    setActiveUserId,
    rewards,
    points,
    history,
    bootLoading,
    panel,
    setPanel,
    selectedReward,
    setSelectedReward,
    redeemSubmitting,
    flash,
    dismissFlash,
    handleRedeem,
    handleCancelRedeem,
  } = useRewardHub();

  if (bootLoading) {
    return (
      <div className="rh-page">
        <div className="rh-page__inner">
          <p className="rh-subtitle">Loading rewards…</p>
        </div>
      </div>
    );
  }

  if (userOptions.length === 0) {
    return (
      <div className="rh-page">
        <div className="rh-page__inner">
          <p className="rh-subtitle">No users found. Run bin/rails db:seed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rh-page">
      <div className="rh-page__inner rh-page__stack">
        <FlashMessage flash={flash} onDismiss={dismissFlash} />

        <RewardHubToolbar users={userOptions} selectedUserId={activeUserId} onUserChange={setActiveUserId} />

        <PointsBalance points={points} />

        <RewardHubTabs
          panel={panel}
          onPanelChange={setPanel}
          browsePanel={
            <>
              {rewards.map((r) => (
                <RewardCard
                  key={r.id}
                  reward={r}
                  canAfford={points >= r.point_cost}
                  onRedeem={setSelectedReward}
                />
              ))}
            </>
          }
          historyPanel={<RedemptionHistory history={history} />}
        />
      </div>

      <RedeemDialog
        reward={selectedReward}
        open={!!selectedReward}
        isSubmitting={redeemSubmitting}
        onConfirm={handleRedeem}
        onCancel={handleCancelRedeem}
      />
    </div>
  );
}

const Index = () => (
  <RewardHubProvider>
    <RewardHubPage />
  </RewardHubProvider>
);

export default Index;
