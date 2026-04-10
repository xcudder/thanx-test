import type { UserOption } from "@/types/reward-hub";
import UserSelector from "@/components/reward-hub/UserSelector";

interface RewardHubToolbarProps {
  users: UserOption[];
  selectedUserId: string;
  onUserChange: (id: string) => void;
}

const RewardHubToolbar = ({ users, selectedUserId, onUserChange }: RewardHubToolbarProps) => (
  <div className="rh-toolbar">
    <div>
      <h1 className="rh-title">Rewards</h1>
      <p className="rh-subtitle">Browse, redeem, and track rewards.</p>
    </div>
    <UserSelector users={users} selectedId={selectedUserId} onChange={onUserChange} />
  </div>
);

export default RewardHubToolbar;
