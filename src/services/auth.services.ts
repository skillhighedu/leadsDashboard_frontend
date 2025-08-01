import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";

export interface AuthResponse {
  role: string;
}

export const checkRole = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<AuthResponse>>(
      "/check/auth/role"
    );
    console.log(response)
    const role = response.data.additional?.role;

    if (!role) {
      throw new Error("Login response is missing token or role");
    }

   
    return { role }
  } catch (error) {
    throw handleApiError(error);
  }
};
