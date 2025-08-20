import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";

export interface AssignmentResponse {
  count: number;
}

export const assignLeadToTeam = async (
  teamId: number,
  leadIds: string[]
): Promise<AssignmentResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<AssignmentResponse>>(
      `/team-assignments/teams/${teamId}/leads`,
     { leadIds }
    );
    if (!response.data.additional) {
      throw new Error("Assignment response is missing");
    }
    
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const assignLeadToTeamMemebers = async (
  memberId: number,
  leadIds: string[]
): Promise<AssignmentResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<AssignmentResponse>>(
      `/team-assignments/members/${memberId}/leads`,
     { leadIds }
    );
    if (!response.data.additional) {
      throw new Error("Assignment response is missing");
    }
    
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
export const updateLeadState = async (
  leadId:number,
  state:string,
): Promise<AssignmentResponse> => {
  try {

    const response = await apiClient.put<ApiResponse<AssignmentResponse>>(
      `/team-assignments/lead/change-lead-state/${leadId}`,{state}
    );

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }


    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};