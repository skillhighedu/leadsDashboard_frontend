import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";

import { handleApiError } from "@/utils/errorHandler";

export interface RoleInfo {
  name: string;
  uuid: string;
}

interface Employee {
  id: number;
  name: string;
  User: {
    email: string;
  };
}


export interface Team {
  id: number
  uuid: string
  teamName: string
  colorCode: string
  teamLeadId: number
  teamLead: {
    id: number
    uuid: string
    name: string
  }
  employees: {
    id: number
    uuid: string
    name: string
    User: {
      email: string
      role: {
        name: string
      }
    }[]
  }[]
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
      "/teams/teamMembers"
    );
    console.log(response)
    return response.data.data ?? [];
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
    console.log(payload);
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

// export const fetchTeamMembers  = async (uuid: string) => {
//     const response = await apiClient.get(`/teams/teamMembers/${uuid}`);
//     return response
// }

