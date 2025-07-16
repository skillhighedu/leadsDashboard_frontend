// services/leads.service.ts

import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";
import { handleApiError } from "@/utils/errorHandler";

/**
 * Fetch leads from the backend with optional pagination
 * @param page default = 1
 * @param limit default = 50
 */
export const fetchLeads = async (
  page = 1,
  search = '',
  status = ''
): Promise<LeadsResponse> => {
  try {
 
    const query = new URLSearchParams({
      page: page.toString(),
      limit: '50',
      search: search || '',
      status: status || 'NEWLY_GENERATED',
    });


    const response = await apiClient.get<ApiResponse<LeadsResponse>>(
      `/leads/all-leads?${query.toString()}`
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }

    // console.log(response.data.additional);
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const uploadLeadsFile = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file",file);

        const response = await apiClient.post("/leads/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        console.log(response.data.additional)
        return response.data.additional;
    } catch (error) {
        throw handleApiError(error);
    }
}


export const addTicketAmount = async (
  leadId: string,
  ticketAmount: number,
): Promise<LeadsResponse> => {
  try {
   
    const response = await apiClient.put<ApiResponse<LeadsResponse>>(
      `/team-assignments/lead/${leadId}/ticket-amount`,
      {ticketAmount}
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUpFrontAmount = async (
  leadId: string,
  upFrontFee: number,
): Promise<LeadsResponse> => {
  try {
   
    const response = await apiClient.put<ApiResponse<LeadsResponse>>(
      `/team-assignments/lead/${leadId}/upfront-amount`,
      {upFrontFee}
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
export interface LeadStatusCount {
  status: string;
  _count: {
    status: number;
  };
}

export interface RevenueData {
  filtersApplied: Record<string, any>; // You can narrow this if needed
  value: number;
}

export interface LeadAnalyticsResponse {
  leadStatusCounts: LeadStatusCount[];
  revenue: RevenueData;
  teamPaymentCounts: any[]; // Replace `any` with a proper type if needed
}


export const leadAnalytics = async (): Promise<LeadAnalyticsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
      "/lead-analytics/leads/analytics"
    );

    if (!response.data.additional) {
      throw new Error("No analytics data found in the response.");
    }

    console.log(response.data.additional);
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

