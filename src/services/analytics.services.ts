import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";
import { type LeadStatus } from "@/constants/status.constant";

export type StatusSummary = {
  status: LeadStatus;
  count: number;
  totalTicketAmount: number;
  generatedAmount:number;
  projectedAmount:number;
};

export type TeamStatusAnalytics = {
  teamAssignedId: number;
  teamName: string;
  teamLeadName: string;
  statuses: StatusSummary[];
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
}

type DateFilters = {
  fromDate: Date;
  toDate: Date;
};

export type RawTeamAnalytics = {
  id: number;
  name: string;
  teamName: string;
  teamLead: {
    name: string;
  };
  teamStatuses :{
   count :number;
   status:string
  }[];
  employees: {
    id: number;
    name: string;
    statuses: {
      status: string;
      count: number;
    }[];
  }[];
  statuses: {
    status: string;
    count: number;
    totalTicketAmount?: number;
    generatedAmount?: number;
    projectedAmount?: number;
  }[];
};


export const fetchAllTeamsAnalytics = async (filters: DateFilters): Promise<TeamStatusAnalytics> => {
  try {
    const response = await apiClient.get<ApiResponse<TeamStatusAnalytics>>(
      "lead-analytics/lead-VM/analytics?fromDate=" + filters.fromDate.toISOString() + "&toDate=" + filters.toDate.toISOString()
    );
    
    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAnalytics = async (filters: DateFilters): Promise<LeadAnalyticsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
      "lead-analytics/leads/analytics?fromDate=" + filters.fromDate.toISOString() + "&toDate=" + filters.toDate.toISOString()
    );
    
    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeamsAnalytics = async (filters: DateFilters): Promise<RawTeamAnalytics[]> => {
  try {
    const response = await apiClient.get<ApiResponse<RawTeamAnalytics[]>>(
      "/lead-analytics/team-leads/analytics?fromDate=" + filters.fromDate.toISOString() + "&toDate=" + filters.toDate.toISOString()
    );
    
    if (!response.data.additional) {
      throw new Error("Analytics data is missing");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
