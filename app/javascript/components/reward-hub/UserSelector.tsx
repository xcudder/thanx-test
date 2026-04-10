import type { UserOption } from "@/types/reward-hub";

interface UserSelectorProps {
  users: UserOption[];
  selectedId: string;
  onChange: (id: string) => void;
}

const UserSelector = ({ users, selectedId, onChange }: UserSelectorProps) => {
  const selected = users.find((u) => u.id === selectedId);

  return (
    <div className="user-selector">
      <span className="user-selector__label">Viewing as</span>
      <div className="user-selector__native-row">
        <span className="user-selector__initials" aria-hidden>
          {selected?.avatar ?? "?"}
        </span>
        <select
          className="rh-native-select"
          value={selectedId}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Select user"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default UserSelector;
