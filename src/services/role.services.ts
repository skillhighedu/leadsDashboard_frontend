import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
;
import { handleApiError } from "@/utils/errorHandler";

export interface Permission {
  id: number;
  uuid: string;
  roleId: number;
  uploadData: boolean;
  createData: boolean;
  editData: boolean;
  assignData: boolean;
  deleteData: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

export interface Role {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission;
}


export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      "/roles/allRoles"
    );
    console.log(response.data.additional)

    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};
