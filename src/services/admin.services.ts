import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";

export interface LoginResponse {
  token: string;
}

export const adminLogin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/employes/login",
      { email, password }
    );

    const token = response.data.additional?.token;

    if (!token) {
      throw new Error("Login response is missing token");
    }


    localStorage.setItem("token", token);
    window.location.href = "/"; // Redirect to home page after login
    return { token };
  } catch (error) {
    throw handleApiError(error);
  }
};
