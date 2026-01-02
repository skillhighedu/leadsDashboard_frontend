import { Roles, type Roles as RoleType } from "@/constants/role.constant";

// const TEAM_ROLES = [
//   Roles.ADMIN,
//   Roles.VERTICAL_MANAGER,
//   Roles.EXECUTIVE,
//   Roles.LEAD_GEN_MANAGER,
//   Roles.MARKETING_HEAD,
// ] as const;

// export const canViewTeamAnalytics = (role?: RoleType) => {
//   if (!role) return false;
//   return (TEAM_ROLES as readonly RoleType[]).includes(role);
// };

const TEAM_ANALYTICS_SET = new Set<RoleType>([
  Roles.VERTICAL_MANAGER,
  Roles.EXECUTIVE,
  Roles.LEAD_GEN_MANAGER,
  Roles.MARKETING_HEAD,
  Roles.ADMIN,
]);

export const canViewTeamAnalytics = (role?: RoleType) =>
  !!role && TEAM_ANALYTICS_SET.has(role);

const SELF_ANALYTICS_SET = new Set<RoleType>([
   Roles.ADMIN,
    Roles.VERTICAL_MANAGER,
    Roles.MARKETING_HEAD,
    Roles.LEAD_GEN_MANAGER,
    Roles.EXECUTIVE, 
    Roles.INTERN,    
    Roles.FRESHER,   
    Roles.TL_IC,
    Roles.LEAD_MANAGER
]);

export const canViewSelfAnalytics = (role?: RoleType) => 
    !!role && SELF_ANALYTICS_SET.has(role);