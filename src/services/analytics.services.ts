import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";
import { type LeadStatus } from "@/constants/status.constant";
import type {
  SelfAnalticsMode,
//   SelfLeadAnalyticsDailyResponse,
  SelfLeadAnalyticsSummaryResponse,
} from "@/types/leads";
import { format } from "date-fns";
import type { TeamLeadAnalyticsResponse } from "@/types/analytics";

export type LeadOwnerStats = {
  [ownerName: string]: {
    [status: string]: number;
  };
};

export type StatusSummary = {
  status: LeadStatus;
  count: number;
  totalTicketAmount: number;
  generatedAmount: number;
  projectedAmount: number;
  leadOwnerNames: string[];
};

export type TeamStatusAnalytics = {
  teamAssignedId: number;
  teamName: string;
  teamLeadName?: string;
  statuses: StatusSummary[];

  members: {
    memberId: number;
    memberName: string;
    statuses: StatusSummary[];
  }[];
  totalGenerated: number;
  totalProjected: number;

  leadOwnerStats: LeadOwnerStats;
};

export interface LeadStatusCount {
  status: LeadStatus;
  count: number;
}

export interface LeadRevenue {
  total: number;
}

export interface LeadAnalyticsResponse {
  leadStatusCounts: LeadStatusCount[];
  revenue: LeadRevenue;
  fees: {
    totalGenerated: number;
    totalProjected: number;
  };
}

export type DateFilters = {
  fromDate: Date;
  toDate: Date;
};

// export type RawTeamAnalytics = {
//   id: number;
//   name: string;
//   teamName: string;
//   teamLead: {
//     name: string;
//   };
//   teamStatuses: {
//     count: number;
//     status: string;
//   }[];
//   employees: {
//     id: number;
//     name: string;
//     selfGenTrueCount: number;
//     selfGenByStatus: Record<string, number>;
//     statuses: {
//       status: string;
//       count: number;
//     }[];
//   }[];
//   statuses: {
//     status: string;
//     count: number;
//     totalTicketAmount?: number;
//     generatedAmount?: number;
//     projectedAmount?: number;
//   }[];
//   range: {
//     from: string;
//     to: string;
//   };
// };

export const fetchAllTeamsAnalytics = async (
  filters: DateFilters
): Promise<TeamStatusAnalytics[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TeamStatusAnalytics[]>>(
      "lead-analytics/lead-VM/analytics?fromDate=" +
        filters.fromDate.toISOString() +
        "&toDate=" +
        filters.toDate.toISOString()
    );

    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAnalytics = async (
  filters: DateFilters
): Promise<LeadAnalyticsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
      "lead-analytics/leads/analytics?fromDate=" +
        filters.fromDate.toISOString() +
        "&toDate=" +
        filters.toDate.toISOString()
    );

    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeamsAnalytics = async (
  filters?: Partial<DateFilters>
): Promise<TeamLeadAnalyticsResponse> => {
  try {
     const params: string[]= [];
    
    if (filters?.fromDate) params.push(`fromDate=${format(filters?.fromDate, "yyyy-MM-dd")}`)
    if (filters?.toDate) params.push(`toDate=${format(filters?.toDate, "yyyy-MM-dd")}`)

    const query = params.length ? `?${params.join("&")}` : "";

    // const response = await apiClient.get<ApiResponse<RawTeamAnalytics[]>>(
    //   "/lead-analytics/team-leads/analytics?fromDate=" +
    //     filters?.fromDate?.toISOString() +
    //     "&toDate=" +
    //     filters?.toDate?.toISOString()
    // );
    const response = await apiClient.get<ApiResponse<TeamLeadAnalyticsResponse>>(
      `/lead-analytics/team-leads/analytics${query}`
    );

    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    console.log(response, "RESPONSE1");
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeamsActualAnalytics = async (
  filters?: Partial<DateFilters>
): Promise<LeadAnalyticsResponse> => {
  try {
    const params: string[]= [];
    
    if (filters?.fromDate) params.push(`fromDate=${format(filters?.fromDate, "yyyy-MM-dd")}`);
    if (filters?.toDate) params.push(`toDate=${format(filters?.toDate, "yyyy-MM-dd")}`)
    
    const query = params.length ? `?${params.join("&")}` : "";

   
    // const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
    //   "/lead-analytics/team/analytics?fromDate=" +
    //     filters?.fromDate?.toISOString() +
    //     "&toDate=" +
    //     filters?.toDate?.toISOString()
    // );
    
    const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
      `/lead-analytics/team/analytics${query}`
    );

    console.log(response, "Response2")
    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

type LeadStatusCounts = {
  status: string;
  count: number;
};
export type OpsAnalyticsResponse = {
  leadStatusCounts: LeadStatusCounts[];
};

export const fetchOpsAnalytics = async (
  filters: DateFilters
): Promise<OpsAnalyticsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<OpsAnalyticsResponse>>(
      "/lead-analytics/ops-team/analytics?fromDate=" +
        filters.fromDate.toISOString() +
        "&toDate=" +
        filters.toDate.toISOString()
    );

    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchSelfAnalytics = async (
  filters?: Partial<DateFilters>,
  mode: SelfAnalticsMode = "summary"
): Promise<
  SelfLeadAnalyticsSummaryResponse 
> => {
  try {
    const params: string[] = [];
    if (filters?.fromDate)
      params.push(`fromDate=${format(filters.fromDate, "yyyy-MM-dd")}`);
    if (filters?.toDate)
      params.push(`toDate=${format(filters.toDate, "yyyy-MM-dd")}`);

    if (mode === "day") params.push(`groupBy=day`);

    const query = params.length ? `?${params.join("&")}` : "";

    const response = await apiClient.get<
      ApiResponse<
        SelfLeadAnalyticsSummaryResponse 
      >
    >(`/lead-analytics/selfAnalytics${query}`);

    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
