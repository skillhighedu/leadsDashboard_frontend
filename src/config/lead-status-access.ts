// src/config/lead-status-access.ts

import { Roles } from "@/constants/role.constant";
import { type LeadStatus, LeadStatuses } from "@/constants/status.constant";

export const LeadStatusAccessMap: Record<Roles, LeadStatus[]> = {
    [Roles.ADMIN]: [...LeadStatuses],
    [Roles.VERTICAL_MANAGER]: [
        
        // "ASSIGNED",
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
        "FULLY_PAID",
        "ALL"
        // "PENDING"
    ],
    [Roles.LEAD_GEN_MANAGER]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.MARKETING_HEAD]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.EXECUTIVE]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.INTERN]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.FRESHER]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.TL_IC]: [
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
        "FULLY_PAID",
        "ALL"
    ],
    [Roles.OPSTEAM]: [
        "PAID",
        "FULLY_PAID",
    ],
    [Roles.ALL]: [],
    [Roles.LEAD_MANAGER]: [],
    [Roles.HR]: []
};