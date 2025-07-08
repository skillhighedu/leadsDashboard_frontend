import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";

import { handleApiError } from "@/utils/errorHandler";
import type { Employee } from "./employes.services";

export interface RoleInfo {
  name: string;
  uuid: string;
}

interface ExecutivesResponse {
  id: number;
  name: string;
  uuid:string
}



export interface TeamResponse {
 id: number
  uuid: string
  teamName: string
  colorCode: string
  teamLeadId: number
  teamLead : TeamLeadResponse[]
  employees:EmployeeResponse[]
}

export interface TeamLeadResponse {
    id: number
    uuid: string
    name: string
}

export interface EmployeeResponse {
    id: number
    uuid: string
    name: string
    User:UserData[]
}

export interface UserData {
    email: string
      role: {
        name: string
    }
}


export interface DeleteTeamResponse {
  message: string;
  code: number;
}

export const fetchExecutives = async (): Promise<ExecutivesResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ExecutivesResponse[]>>(
      "/teams/executives"
    );
    console.log(response)

    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeams = async (): Promise<TeamResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TeamResponse[]>>(
      "/teams/teamMembers"
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

export const deleteTeam = async (id: number): Promise<DeleteTeamResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<DeleteTeamResponse>>(`/teams/team/${id}`);
    // The backend returns a SuccessResponse with message and code
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface TeamMemberPayload {
  employeeId: number;
}

export interface TeamMemberResponse {
  message: string;
  code: number;
}

export const addMemberToTeam = async (teamId: number, payload: TeamMemberPayload): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<TeamMemberResponse>>(`/teams/team/${teamId}/add-member`, payload);
    console.log(response)
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeMemberFromTeam = async (teamId: number, payload: TeamMemberPayload): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse<TeamMemberResponse>>(`/teams/team/${teamId}/remove-member`, { data: payload });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

