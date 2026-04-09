import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/lovable-ui/select";
import { Avatar, AvatarFallback } from "@/components/lovable-ui/avatar";
import type { UserOption } from "@/lib/rewards-data";

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
      <Select value={selectedId} onValueChange={onChange}>
        <SelectTrigger className="ui-select-trigger--user">
          <div className="user-selector__row">
            <Avatar className="ui-avatar--sm">
              <AvatarFallback className="ui-avatar__fallback--primary">{selected?.avatar}</AvatarFallback>
            </Avatar>
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              <div className="user-selector__row">
                <Avatar className="ui-avatar--xs">
                  <AvatarFallback className="ui-avatar__fallback--primary">{u.avatar}</AvatarFallback>
                </Avatar>
                {u.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSelector;
