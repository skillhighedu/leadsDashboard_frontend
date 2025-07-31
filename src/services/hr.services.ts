import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { IsActiveResponse,  staffLoginsResponse } from "@/types/hr";
import { handleApiError } from "@/utils/errorHandler";

export const fetchStaffLogins = async (
  day?: string
): Promise<staffLoginsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<staffLoginsResponse>>(
      "/staff/staff-logins",
      {
        params: day ? { day } : {},
      }
    );
    const data = response.data.additional?.data;
    const count = response.data.additional?.count ?? 0;

    console.log(response);

    return {
      data: Array.isArray(data) ? data : [],
      count,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const WorkStatus = {
  PRESENT: "PRESENT",
  FULL: "FULL",
  HALF: "HALF",
  ABSENT: "ABSENT",
} as const;

export type WorkStatusType = (typeof WorkStatus)[keyof typeof WorkStatus];

export const updateStaffLoginStatus = async (
  uuid: string,
  status: WorkStatusType
): Promise<void> => {
  try {
    await apiClient.put(`/staff/${uuid}/status`, { status });
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateStaffLogin = async (): Promise<IsActiveResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<IsActiveResponse>>(
      "/staff/activate"
    );
    console.log(response)
    if (!response.data.additional) {
      throw new Error("No data returned from API");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateStaffLogin = async (): Promise<IsActiveResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<IsActiveResponse>>(
      "/staff/deactivate"
    );
    console.log(response)
    if (!response.data.additional) {
      throw new Error("No data returned from API");
    }

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
}; 