// src/config/lead-status-access.ts

import { Roles } from "@/constants/role.constant";
import { type LeadStatus, LeadStatuses } from "@/constants/status.constant";

export const LeadStatusAccessMap: Record<Roles, LeadStatus[]> = {
    [Roles.ADMIN]: [...LeadStatuses],
    [Roles.VERTICAL_MANAGER]: [
        "ASSIGNED",
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
        "PENDING"
    ],
    [Roles.EXECUTIVE]: [
        "ASSIGNED",
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
        "PENDING"
    ],
    [Roles.INTERN]: [
        "ASSIGNED",
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
        "PENDING"
    ],
    [Roles.OPSTEAM]: [
        "PAID",
        "PENDING",
    ],
    [Roles.ALL]: []
    [Roles.HR]: []
};
