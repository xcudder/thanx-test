import { useCallback, useEffect, useState } from "react";
import PointsBalance from "@/components/reward-hub/PointsBalance";
import RewardCard from "@/components/reward-hub/RewardCard";
import RedeemDialog from "@/components/reward-hub/RedeemDialog";
import RedemptionHistory from "@/components/reward-hub/RedemptionHistory";
import UserSelector from "@/components/reward-hub/UserSelector";
import FlashMessage, { type FlashPayload } from "@/components/reward-hub/FlashMessage";
import type { Redemption, Reward, UserOption } from "@/lib/rewards-data";
import { mapHistoryRow, mapRewardDto, initialsFromName } from "@/lib/rewardHubMappers";
import { ApiError } from "@/services/http";
import { fetchBalance, fetchRedemptionHistory, fetchUsers } from "@/services/usersService";
import { fetchRewards } from "@/services/rewardsService";
import { redeemReward } from "@/services/redemptionsService";

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

type Panel = "browse" | "history";

const Index = () => {
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [activeUserId, setActiveUserId] = useState("");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<Redemption[]>([]);
  const [bootLoading, setBootLoading] = useState(true);
  const [panel, setPanel] = useState<Panel>("browse");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);
  const [flash, setFlash] = useState<FlashPayload | null>(null);

  const dismissFlash = useCallback(() => setFlash(null), []);

  const handleCancelRedeem = useCallback(() => {
    if (!redeemSubmitting) setSelectedReward(null);
  }, [redeemSubmitting]);

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
          setFlash({
            variant: "error",
            title: "Could not load rewards",
            description: "Check that the Rails server is running and the database is seeded.",
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
          setFlash({ variant: "error", title: "Could not load user" });
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
      const name = userOptions.find((u) => u.id === activeUserId)?.name ?? "User";
      setFlash({
        variant: "info",
        title: `${selectedReward.name} redeemed!`,
        description: `${selectedReward.cost.toLocaleString()} points deducted from ${name}.`,
      });
      setSelectedReward(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) {
        const code =
          typeof e.body === "object" && e.body && "error" in e.body
            ? String((e.body as { error: string }).error)
            : undefined;
        setFlash({
          variant: "error",
          title: "Could not redeem",
          description: redeemErrorMessage(code),
        });
      } else {
        setFlash({
          variant: "error",
          title: "Could not redeem",
          description: "Something went wrong. Try again.",
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
        <FlashMessage flash={flash} onDismiss={dismissFlash} />

        <div className="rh-toolbar">
          <div>
            <h1 className="rh-title">Rewards</h1>
            <p className="rh-subtitle">Browse, redeem, and track rewards.</p>
          </div>
          <UserSelector users={userOptions} selectedId={activeUserId} onChange={setActiveUserId} />
        </div>

        <PointsBalance points={points} />

        <div className="rh-tabs-panel">
          <div className="rh-tab-bar" role="tablist" aria-label="Rewards sections">
            <button
              type="button"
              role="tab"
              aria-selected={panel === "browse"}
              className={`rh-tab-btn${panel === "browse" ? " rh-tab-btn--active" : ""}`}
              onClick={() => setPanel("browse")}
            >
              Browse
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={panel === "history"}
              className={`rh-tab-btn${panel === "history" ? " rh-tab-btn--active" : ""}`}
              onClick={() => setPanel("history")}
            >
              History
            </button>
          </div>

          {panel === "browse" ? (
            <div className="rh-reward-grid" role="tabpanel">
              {rewards.map((r) => (
                <RewardCard key={r.id} reward={r} canAfford={points >= r.cost} onRedeem={setSelectedReward} />
              ))}
            </div>
          ) : (
            <div role="tabpanel">
              <RedemptionHistory history={history} />
            </div>
          )}
        </div>
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
};

export default Index;
