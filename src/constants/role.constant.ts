export const Roles = {
  ALL: "ALL",
  ADMIN: "ADMIN",
  VERTICAL_MANAGER: "verticalManager",
  EXECUTIVE: "executive",
  INTERN: "intern",
  HR: "hr",
  OPSTEAM: "OpsTeam",

} as const;

export type Roles = typeof Roles[keyof typeof Roles];

