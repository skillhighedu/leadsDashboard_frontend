// services/leads.service.ts

import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { CreateLeadInput, Leads, LeadsResponse, UpdateReferredByInput, UploadLeadsResponse } from "@/types/leads";
import { handleApiError } from "@/utils/errorHandler";
import { toast } from "sonner";

/**
 * Fetch leads from the backend with optional pagination
 * @param page default = 1
 * @param limit default = 50
 */
export const fetchLeads = async (
  page = 1,
  search = '',
  status = '',
  day?: string
): Promise<LeadsResponse> => {
  try {
 
    const query = new URLSearchParams({
      page: page.toString(),
      limit: '50',
      search: search || '',
      status: status || 'NEWLY_GENERATED',
    });

    if (day){
        query.append("day", day)
    }

    const response = await apiClient.get<ApiResponse<LeadsResponse>>(
      `/leads/all-leads?${query.toString()}`
    );

    console.log("LEADS:", response);

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const uploadLeadsFile = async (file: File): Promise<UploadLeadsResponse> => {
    try {
        const formData = new FormData();
        formData.append("file",file);

        const response = await apiClient.post<ApiResponse<UploadLeadsResponse>>("/leads/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        console.log("UPLOAD SHEET",response);
        
        if (!response.data.additional) {
            throw new Error("No upload data found in the response.");
        }

        return response.data.additional;
    } catch (error) {
        throw handleApiError(error);
    }
}


export const addTicketAmount = async (
  leadId: string,
  upFrontFee:number,
  ticketAmount: number,
): Promise<LeadsResponse> => {
  try {
   
    const response = await apiClient.put<ApiResponse<LeadsResponse>>(
      `/team-assignments/lead/${leadId}/ticketDetails`,
      {upFrontFee,ticketAmount}
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
  filtersApplied: Record<string, unknown>; // You can narrow this if needed
  value: number;
}

export interface LeadAnalyticsResponse {
  leadStatusCounts: LeadStatusCount[];
  revenue: RevenueData;
  teamPaymentCounts: unknown[]; // Replace `any` with a proper type if needed
}


export const leadAnalytics = async (): Promise<LeadAnalyticsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadAnalyticsResponse>>(
      "/lead-analytics/leads/analytics"
    );

    if (!response.data.additional) {
      throw new Error("No analytics data found in the response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteLead = async (uuid:string)=> {
  try {
    const response = await apiClient.delete<ApiResponse<LeadsResponse>>(
      `/leads/${uuid}`
    );
    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};

export const unAssginLead = async (uuid:string)=> {
  try {
    const response = await apiClient.put<ApiResponse<LeadsResponse>>(
      `/leads/unAssign/${uuid}`
    );
   
      toast.success(response.data.message)
      
    
    
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};

export const selfGenStatus = async (uuid:string, newStatus: boolean)=> {
  try {
    const response = await apiClient.put<ApiResponse<null>>(
      `/leads/isSelfGen/${uuid}`, {isSelfGen: newStatus}
    );
    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};


export const createLead = async (leadData: CreateLeadInput): Promise<LeadsResponse> => {
    try {
        const response = await apiClient.post<ApiResponse<LeadsResponse>>(
            "/leads/createLead", leadData
        );
        if (!response.data.additional) {
            throw new Error("No leads data found in the response.");
        }

        return response.data.additional;
    } catch (error) {
        throw handleApiError(error);
    }
}

export const updateReferredBy = async (
  id: number,
  data: UpdateReferredByInput
): Promise<Leads> => {
  try {
    const response = await apiClient.put<ApiResponse<Leads>>(
      `/leads/${id}/referred-by`,
      data
    );

    if (!response.data.additional) {
      throw new Error("No updated lead data found in response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const addComment = async (
  uuid: string,
  comment:string,
): Promise<LeadsResponse> => {
  try {
   
    const response = await apiClient.put<ApiResponse<LeadsResponse>>(
      `/leads/comment/${uuid}`,
      {comment}
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
