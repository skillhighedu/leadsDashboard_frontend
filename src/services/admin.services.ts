import apiClient from "@/config/axiosConfig"
import type { ApiResponse } from "@/types/api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

export interface LoginFormData {
  email: string,
  password: string,
}

export const adminLogin = async (email: string, password: string): Promise<LoginFormData> => {
  try {

    const response = await apiClient.post<ApiResponse<LoginFormData>>(
      "/admin/login",
      { email, password },
    );

    if (!response.data.additional) {
      throw new Error("Data is undefined");
    }
    toast.success(response.data.message );
    localStorage.setItem("token", response.data.additional.token);

    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};
