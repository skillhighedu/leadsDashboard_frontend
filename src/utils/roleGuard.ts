// import { Roles, type Roles as RoleType } from "@/constants/roles.constant";

import { Roles, Roles as RoleType } from "@/constants/role.constant";

export const toRoleType = (role?: string): RoleType | undefined => {
  if (!role) return undefined;
  const values = Object.values(Roles) as string[];
  return values.includes(role) ? (role as RoleType) : undefined;
};
