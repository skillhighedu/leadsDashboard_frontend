export const LeadStatuses = [
//   "ASSIGNED",
"CGFL",
  "DNP", // Do Not Pick
  "FOLLOW_UP",
  "CBL", // Callback Later
  "NOT_INTERESTED",
  "PAID",
  "BUSY",
  "SWITCH_OFF",
  "OUT_OF_SERVICE",
  "NOT_CONNECTED",
  "SENT_DETAILS",
  "TIME",
  "HUNG_UP",
  "GIVEN",
  "JUNK",
  "NEWLY_GENERATED",
  "FULLY_PAID"
//   "PENDING"

] as const;

export type LeadStatus = typeof LeadStatuses[number];
