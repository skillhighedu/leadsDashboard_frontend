export const Roles = {
  ALL: "ALL",
  ADMIN: "ADMIN",
  VERTICAL_MANAGER: "verticalManager",

  MARKETING_HEAD: "marketingHead",
  LEAD_MANAGER: "leadManager",
  EXECUTIVE: "bdm",
  INTERN: "experiencedIntern",
  TL_IC: "tl-ic",
  FRESHER: "intern",

  HR: "hr",
  OPSTEAM: "OpsTeam",
  LEAD_GEN_MANAGER: "leadGenerationManager",

} as const;

export type Roles = typeof Roles[keyof typeof Roles];

