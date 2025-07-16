import apiClient from "@/config/axiosConfig";
import type { LeaveApplicationPayload, LeaveApplicationResponse, LeavesResponse, UpdatedLeaveResponse, UpdateLeaveStatusPayload } from "@/types/leaveApplication";
import type { ApiResponse } from "@/types/api";
import { handleApiError } from "@/utils/errorHandler";


export const submitLeaveApplication = async (payload:LeaveApplicationPayload): Promise<LeaveApplicationResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LeaveApplicationResponse>>(
      `/staff/leave-application`, payload
    );

    if (!response.data.additional) {
      throw new Error("No additional data returned from API");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchLeaveApplications = async(date: string): Promise<LeavesResponse> => {
    const response = await apiClient.get<ApiResponse<LeavesResponse>>("/staff/leave-applications", {
        params: {date},
    });
    if (!response.data.additional) {
        throw new Error("No additional data returned from API");
    }
    console.log(response)
    return response.data.additional ;
}

export const updateLeaveStatus = async(uuid: string, payload: UpdateLeaveStatusPayload): Promise<UpdatedLeaveResponse> => {
    const response = await apiClient.put<ApiResponse<UpdatedLeaveResponse>>(
        `staff/leave-application/status/${uuid}`, payload
    );

    if (!response.data.additional) {
    throw new Error("No data returned from server");
  }

  console.log(response)
  return response.data.additional;
} 