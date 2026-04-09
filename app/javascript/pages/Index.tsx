import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import PointsBalance from "@/components/PointsBalance";
import RewardCard from "@/components/RewardCard";
import RedeemDialog from "@/components/RedeemDialog";
import RedemptionHistory from "@/components/RedemptionHistory";
import UserSelector from "@/components/UserSelector";
import { rewards, users as seedUsers, type Reward, type Redemption, type AppUser } from "@/lib/rewards-data";
import { Gift, History } from "lucide-react";

const Index = () => {
  const [usersState, setUsersState] = useState<AppUser[]>(seedUsers);
  const [activeUserId, setActiveUserId] = useState(seedUsers[0].id);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const activeUser = usersState.find((u) => u.id === activeUserId)!;

  const handleRedeem = useCallback(() => {
    if (!selectedReward) return;
    const redemption: Redemption = {
      id: crypto.randomUUID(),
      rewardId: selectedReward.id,
      rewardName: selectedReward.name,
      cost: selectedReward.cost,
      redeemedAt: new Date(),
    };
    setUsersState((prev) =>
      prev.map((u) =>
        u.id === activeUserId
          ? { ...u, points: u.points - selectedReward.cost, history: [redemption, ...u.history] }
          : u,
      ),
    );
    setAnimKey((k) => k + 1);
    toast({
      title: `${selectedReward.name} redeemed!`,
      description: `${selectedReward.cost.toLocaleString()} points deducted from ${activeUser.name}.`,
    });
    setSelectedReward(null);
  }, [selectedReward, activeUserId, activeUser.name]);

  return (
    <div className="rh-page">
      <div className="rh-page__inner rh-page__stack">
        <div className="rh-toolbar">
          <div>
            <h1 className="rh-title">Rewards</h1>
            <p className="rh-subtitle">Browse, redeem, and track rewards.</p>
          </div>
          <UserSelector users={usersState} selectedId={activeUserId} onChange={setActiveUserId} />
        </div>

        <PointsBalance points={activeUser.points} animateKey={animKey} />

        <Tabs defaultValue="browse" className="rh-tabs-panel">
          <TabsList className="ui-tabs-list--full">
            <TabsTrigger value="browse" className="ui-tabs-trigger--pill">
              <Gift className="ui-tabs-trigger__icon" /> Browse
            </TabsTrigger>
            <TabsTrigger value="history" className="ui-tabs-trigger--pill">
              <History className="ui-tabs-trigger__icon" /> History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="rh-reward-grid">
              {rewards.map((r) => (
                <RewardCard key={r.id} reward={r} canAfford={activeUser.points >= r.cost} onRedeem={setSelectedReward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <RedemptionHistory history={activeUser.history} />
          </TabsContent>
        </Tabs>
      </div>

      <RedeemDialog
        reward={selectedReward}
        open={!!selectedReward}
        onConfirm={handleRedeem}
        onCancel={() => setSelectedReward(null)}
      />
    </div>
  );
};

export default Index;
