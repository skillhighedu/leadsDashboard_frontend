import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";
import { toast } from "sonner";



export interface Employee {
  id: number;
  name: string;
  email: string;
  uuid: string;
  roleId: number;
  roleName: string;
  
}


export const fetchEmployes = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Employee[]>>(
      "/employees/employees"
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export type EditEmployeeResponseType = {
    employee: {
    id: number;
    uuid: string;
    name: string;
    roleId: number;
    roleName: string;
  };
}

export const editEmployee = async (uuid:string,payload:Payload): Promise<EditEmployeeResponseType> => {
  try {
    const response = await apiClient.put<ApiResponse<EditEmployeeResponseType>>(
      `/employees/employee/${uuid}`, payload
    );

    if (!response.data.additional) {
      throw new Error("No additional data returned from API");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

type Payload ={
  name:string;
  email:string;
  roleId:string;
  password?:string;
}

export const createEmployee = async (payload:Payload): Promise<Employee[]> => {
  try {
    const response = await apiClient.post<ApiResponse<Employee[]>>(
      "/employees/create-employee",payload
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};



export const deleteEmployee = async (uuid:string)=> {
  try {
    console.log(uuid)
    const response = await apiClient.delete<ApiResponse<Employee[]>>(
      `/employees/employee/${uuid}`
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