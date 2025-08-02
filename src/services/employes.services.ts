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
  employmentStatus: EmploymentStatus
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

export const EmploymentStatus = {
  IS_WORKING: "IS_WORKING",
  NOT_WORKING: "NOT_WORKING",
} as const;

export type EmploymentStatus = keyof typeof EmploymentStatus;

export type UpdateEmployeeStatusResponse = {
  id: number;
  uuid: string;
  name: string;
  employmentStatus: EmploymentStatus;
  teamId: number;
};

export const updateEmployeeStatus = async (
  uuid: string,
  status: EmploymentStatus
): Promise<UpdateEmployeeStatusResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<UpdateEmployeeStatusResponse>>(
      `employees/employee-status/${uuid}`,
      { status }
    );

    if (!response.data.additional) {
      throw new Error("No additional data returned from API");
    }

    
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface ProfileResponse {
    name: string;
    email: string;
    role: string;
}

export const fetchProfile = async (
): Promise<ProfileResponse> => {
  try {
   const response = await apiClient.get<ApiResponse<ProfileResponse>>("/users/profile");

   if (!response.data.additional) {
      throw new Error("No additional data returned from API");
    }

    console.log(response)
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

