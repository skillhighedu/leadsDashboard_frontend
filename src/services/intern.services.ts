import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";

import { handleApiError } from "@/utils/errorHandler";


export const fetchIntrrnLeads = async (): Promise<LeadsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadsResponse>>(
      `/team-assignments/teams/assigned-leads`
    );

    console.log(response.data)
    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

