import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";

export interface RoleInfo {
  name: string;
  uuid: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  uuid: string;
  role: RoleInfo;
}


export const fetchEmployes = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Employee[]>>(
      "/employes/allEmployes"
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};
