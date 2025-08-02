export const LeadStatuses = [
  "ASSIGNED",
  "DNP", 
  "FOLLOW_UP",
  "CBL", 
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
  "PENDING"
] as const;

export type LeadStatus = typeof LeadStatuses[number];
