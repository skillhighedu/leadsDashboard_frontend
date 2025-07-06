// types/leads.ts

export interface Leads {
  id: number;
  uuid: string;
  email: string;
  phoneNumber: string;
  domain: string;
  status?: string;
  name: string;
  whatsappNumber: string;
  graduationYear: string;
  branch: string;
  college: string;
  preferredLanguage?: string;
  reason?: string | null;
  referredBy?: string | null;
  ownerId?: number | null;
  teamAssignedId?: number | null;
  handlerId?: number | null;
  batch:string;
  assignedTo?:{
 name:string
  },
    owner?:{
 name:string
  },
  createdAt: string;
  updatedAt: string;
  teamAssigned:{
    teamName:string;
    colorCode:string;
  }
}

export interface LeadsResponse {
  leads: Leads[];
  page: number;
  total: number;
  totalPages: number;
}
