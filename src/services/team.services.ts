import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";

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

export interface Team {
    id:number
    teamName:string
}


export const fetchExecutives = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Employee[]>>(
      "/teams/executives"
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Team[]>>(
      "/teams/team"
    );
    console.log(response)
    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};


export const editEmployee = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.post<ApiResponse<Employee[]>>(
      "/employes/createEmployee"
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

type Payload ={
  teamName:string;
  teamLeadId?:number;

}

export const createTeam = async (payload:Payload): Promise<Employee[]> => {
  try {
    const response = await apiClient.post<ApiResponse<Employee[]>>(
      "/teams/create-team",payload
    );

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeamLeads = async (): Promise<LeadsResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LeadsResponse>>(
      `/team-assignments/teams/assigned-leads`
    );

    console.log(response.data)
    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

