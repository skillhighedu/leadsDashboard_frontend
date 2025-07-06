export const Roles = {
  ALL: "ALL",
  ADMIN: "ADMIN",
  VERTICAL_MANAGER: "verticalManager",
  LEAD_MANAGER: "leadManager",
  EXECUTIVE: "executive",
  INTERN: "intern",
  HR: "hr",
} as const;

export type Roles = typeof Roles[keyof typeof Roles];

