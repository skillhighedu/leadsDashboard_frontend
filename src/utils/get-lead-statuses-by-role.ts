import {type Roles } from "@/constants/role.constant";
import { type LeadStatus } from "@/constants/status.constant";
import { LeadStatusAccessMap } from "@/config/lead-status-access";

export function getLeadStatusesByRole(role: Roles): LeadStatus[] {
  return LeadStatusAccessMap[role];
}