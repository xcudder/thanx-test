import type { ReactNode } from "react";
import type { RewardHubPanel } from "@/types/reward-hub";

interface RewardHubTabsProps {
  panel: RewardHubPanel;
  onPanelChange: (panel: RewardHubPanel) => void;
  browsePanel: ReactNode;
  historyPanel: ReactNode;
}

const RewardHubTabs = ({ panel, onPanelChange, browsePanel, historyPanel }: RewardHubTabsProps) => (
  <div className="rh-tabs-panel">
    <div className="rh-tab-bar" role="tablist" aria-label="Rewards sections">
      <button
        type="button"
        role="tab"
        aria-selected={panel === "browse"}
        className={`rh-tab-btn${panel === "browse" ? " rh-tab-btn--active" : ""}`}
        onClick={() => onPanelChange("browse")}
      >
        Browse
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={panel === "history"}
        className={`rh-tab-btn${panel === "history" ? " rh-tab-btn--active" : ""}`}
        onClick={() => onPanelChange("history")}
      >
        History
      </button>
    </div>

    {panel === "browse" ? (
      <div className="rh-reward-grid" role="tabpanel">
        {browsePanel}
      </div>
    ) : (
      <div role="tabpanel">{historyPanel}</div>
    )}
  </div>
);

export default RewardHubTabs;
