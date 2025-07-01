import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

export interface Permission {

  uploadData: boolean;
  createData: boolean;
  editData: boolean;
  assignData: boolean;
  deleteData: boolean;

}

export interface Role {
  id: number;
  uuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  permissions: Permission;
}


export interface Payload {
  name : string;
  permissions: Permission
} 

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      "/roles/allRoles"
    );
   

    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};


export const createRole = async (payload:Payload): Promise<Role[]> => {
  try {
    const response = await apiClient.post<ApiResponse<Role[]>>(
      "/roles/createRole",payload
    );
    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};


export const deleteRole = async (uuid:string): Promise<Role[]> => {
  try {
    const response = await apiClient.delete<ApiResponse<Role[]>>(
      `/roles/deleteRole/${uuid}`
    );
    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editRole = async (uuid:string,payload:Payload): Promise<Role[]> => {
  try {
    const response = await apiClient.put<ApiResponse<Role[]>>(
      `/roles/updateRole/${uuid}`,payload
    );
    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    return response.data.additional ?? []
  } catch (error) {
    throw handleApiError(error);
  }
};
