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
  leadManagerId?: number | null;
  teamId?: number | null;
  assignedToId?: number | null;
  assignedTo?:{
 name:string
  },
  createdAt: string;
  updatedAt: string;
  team:{
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
