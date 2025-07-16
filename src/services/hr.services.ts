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

export const WorkStatus = {
  PRESENT: "PRESENT",
  FULL: "FULL",
  HALF: "HALF",
  ABSENT: "ABSENT",
} as const;

export type WorkStatusType = (typeof WorkStatus)[keyof typeof WorkStatus];


export const updateStaffLoginStatus = async (uuid:string ,status: WorkStatusType): Promise<void> => {
    try {
        await apiClient.put(
        `/staff/${uuid}/status`, {status}
    )
    } catch (error) {
        throw handleApiError(error)
    }
    
} 
