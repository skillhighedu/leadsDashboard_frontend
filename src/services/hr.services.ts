import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { staffLoginsResponse } from "@/types/hr";
import { handleApiError } from "@/utils/errorHandler";

export const fetchStaffLogins = async (day?: string): Promise<staffLoginsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<staffLoginsResponse>>(
      "/staff/staff-logins", {
        params: day ? {day} : {}
      }
    );
    const data = response.data.additional?.data;
    const count = response.data.additional?.count ?? 0;

    console.log(response)

    return {
      data: Array.isArray(data) ? data : [],
      count,
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

// export const updateStaffLogin = async
