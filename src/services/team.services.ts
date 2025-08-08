import apiClient from "@/config/axiosConfig";
import type { ApiResponse } from "@/types/api";
import type { LeadsResponse } from "@/types/leads";

import { handleApiError } from "@/utils/errorHandler";
import type { Employee } from "./employes.services";
import { toast } from "sonner";

export interface RoleInfo {
  name: string;
  uuid: string;
}

interface ExecutivesResponse {
  id: number;
  name: string;
  uuid:string
}

export interface InternsResponse {
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
  teamLead : TeamLeadResponse
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
  status: number
}

export interface TeamMembersResponse {
    id: number
    uuid: string
    teamId:number
    name:string
}


export const fetchExecutives = async (): Promise<ExecutivesResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ExecutivesResponse[]>>(
      "/teams/executives"
    );


    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchInterns = async (): Promise<InternsResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<InternsResponse[]>>(
      "/teams/interns"
    );
    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeams = async (): Promise<TeamResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TeamResponse[]>>(
      "/teams/team-members"
    );
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

    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }
    return response.data.additional;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchTeamMembers = async (): Promise<TeamMembersResponse[]> => {
  try {
    const response = await apiClient.get<ApiResponse<TeamMembersResponse[]>>(
      `/teams/team/members`
    );
    if (!response.data.additional) {
      throw new Error("No leads data found in the response.");
    }
    return response.data.additional ?? [];
  } catch (error) {
    throw handleApiError(error);
  }
};


export const deleteTeam = async (id: number) => {
  try {
    const response = await apiClient.delete<ApiResponse<DeleteTeamResponse>>(`/teams/team/${id}`);
    // The backend returns a SuccessResponse with message and code
    return response.data;
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
  status: boolean
}

export const addMemberToTeam = async (teamId: number, payload: TeamMemberPayload): Promise<TeamMemberResponse> => {
  try {
    const response = await apiClient.post<TeamMemberResponse>(`/teams/team/${teamId}/add-member`, payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeMemberFromTeam = async (teamId: number, payload: TeamMemberPayload):Promise<TeamMemberResponse>  => {
  try {
    const response = await apiClient.delete<TeamMemberResponse>(`/teams/team/${teamId}/remove-member`, { data: payload });

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface EditTeamPayload {
    teamName: string;
    colorCode: string;
    teamLeadId: number;
}

export interface EditTeamResponse {
    id: number;
    teamName: string;
    colorCode : string;
    teamLeadId: number;
}

export const editTeam = async (teamId:number,payload: EditTeamPayload): Promise<EditTeamResponse> => {
  try {
    const response = await apiClient.put<ApiResponse<EditTeamResponse>>(
      `/teams/team/${teamId}`,payload
    );
    
    if (!response.data.additional) {
      throw new Error("No data returned from API");
    }

    if(response.data.success)
    {
      toast.success(response.data.message)
      
    }
    return response.data.additional 
  } catch (error) {
    throw handleApiError(error);
  }
};

