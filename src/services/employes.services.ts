import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";

import { handleApiError } from "@/utils/errorHandler";



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


export const editEmployee = async (id:number,payload:Payload): Promise<Employee[]> => {
  try {
    const response = await apiClient.put<ApiResponse<Employee[]>>(
      `/employees/createEmployee/${id}`, payload
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

type Payload ={
  name:string;
  email:string;
  roleId:string;
  password:string;
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

