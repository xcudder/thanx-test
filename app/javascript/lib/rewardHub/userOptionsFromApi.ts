import type { ApiUser, UserOption } from "@/types/reward-hub";
import { initialsFromName } from "@/lib/initials";

export function userOptionsFromApiUsers(apiUsers: ApiUser[]): UserOption[] {
  return apiUsers.map((u) => ({
    id: String(u.id),
    name: u.name,
    avatar: initialsFromName(u.name),
  }));
}
