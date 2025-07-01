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
export const fetchLeads = async (page = 1, limit = 50): Promise<LeadsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadsResponse>>(
      `/lead/getLeads?page=${page}&limit=${limit}`
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
