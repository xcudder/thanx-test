import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/lovable-ui/tabs";
import { toast } from "@/components/lovable-ui/use-toast";
import PointsBalance from "@/components/reward-hub/PointsBalance";
import RewardCard from "@/components/reward-hub/RewardCard";
import RedeemDialog from "@/components/reward-hub/RedeemDialog";
import RedemptionHistory from "@/components/reward-hub/RedemptionHistory";
import UserSelector from "@/components/reward-hub/UserSelector";
import type { Redemption, Reward, UserOption } from "@/lib/rewards-data";
import { mapHistoryRow, mapRewardDto, initialsFromName } from "@/lib/rewardHubMappers";
import { ApiError } from "@/services/http";
import { fetchBalance, fetchRedemptionHistory, fetchUsers } from "@/services/usersService";
import { fetchRewards } from "@/services/rewardsService";
import { redeemReward } from "@/services/redemptionsService";
import { Gift, History } from "lucide-react";

function redeemErrorMessage(code: string | undefined): string {
  switch (code) {
    case "insufficient_points":
      return "Not enough points for this reward.";
    case "reward_not_available":
      return "That reward is unavailable or out of stock.";
    default:
      return code ? `Could not redeem (${code}).` : "Could not complete redemption.";
  }
}

const Index = () => {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<Redemption[]>([]);
  const [bootLoading, setBootLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [apiUsers, rewardsRes] = await Promise.all([fetchUsers(), fetchRewards()]);
        if (cancelled) return;
        setUserOptions(
          apiUsers.map((u) => ({
            id: String(u.id),
            name: u.name,
            avatar: initialsFromName(u.name),
          })),
        );
        setRewards(rewardsRes.rewards.map(mapRewardDto));
        const firstId = apiUsers[0] ? String(apiUsers[0].id) : "";
        setActiveUserId(firstId);
      } catch {
        if (!cancelled) {
          toast({
            title: "Could not load rewards",
            description: "Check that the Rails server is running and the database is seeded.",
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activeUserId) return;
    let cancelled = false;
    const uid = Number(activeUserId);
    (async () => {
      try {
        const [bal, hist] = await Promise.all([fetchBalance(uid), fetchRedemptionHistory(uid)]);
        if (cancelled) return;
        setPoints(bal.point_balance);
        setHistory(hist.redemptions.map(mapHistoryRow));
      } catch {
        if (!cancelled) {
          toast({ title: "Could not load user", variant: "destructive" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeUserId]);

  const handleRedeem = useCallback(async () => {
    if (!selectedReward) return;
    const uid = Number(activeUserId);
    const rid = Number(selectedReward.id);
    setRedeemSubmitting(true);
    try {
      await redeemReward(uid, rid);
      const [bal, hist, rewardsRes] = await Promise.all([
        fetchBalance(uid),
        fetchRedemptionHistory(uid),
        fetchRewards(),
      ]);
      setPoints(bal.point_balance);
      setHistory(hist.redemptions.map(mapHistoryRow));
      setRewards(rewardsRes.rewards.map(mapRewardDto));
      setAnimKey((k) => k + 1);
      const name = userOptions.find((u) => u.id === activeUserId)?.name ?? "User";
      toast({
        title: `${selectedReward.name} redeemed!`,
        description: `${selectedReward.cost.toLocaleString()} points deducted from ${name}.`,
      });
      setSelectedReward(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        const code = typeof e.body === "object" && e.body && "error" in e.body ? String((e.body as { error: string }).error) : undefined;
        toast({
          title: "Could not redeem",
          description: redeemErrorMessage(code),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Could not redeem",
          description: "Something went wrong. Try again.",
          variant: "destructive",
        });
      }
    } finally {
      setRedeemSubmitting(false);
    }
  }, [selectedReward, activeUserId, userOptions]);

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
        <div className="rh-toolbar">
          <div>
            <h1 className="rh-title">Rewards</h1>
            <p className="rh-subtitle">Browse, redeem, and track rewards.</p>
          </div>
          <UserSelector users={userOptions} selectedId={activeUserId} onChange={setActiveUserId} />
        </div>

        <PointsBalance points={points} animateKey={animKey} />

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
                <RewardCard key={r.id} reward={r} canAfford={points >= r.cost} onRedeem={setSelectedReward} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <RedemptionHistory history={history} />
          </TabsContent>
        </Tabs>
      </div>

      <RedeemDialog
        reward={selectedReward}
        open={!!selectedReward}
        isSubmitting={redeemSubmitting}
        onConfirm={handleRedeem}
        onCancel={() => !redeemSubmitting && setSelectedReward(null)}
      />
    </div>
  );
};

export default Index;
