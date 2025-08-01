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
  ticketAmount?: number
  preferredLanguage?: string;
  reason?: string | null;
  referredBy?: string | null;
  ownerId?: number | null;
  teamAssignedId?: number | null;
  handlerId?: number | null;
  hadReferred:boolean;
  upFrontFee:number;
  remainingFee:number;
  batch: string;
  handler?: {
    name: string
  },
  owner?: {
    name: string
  },
  createdAt: string;
  updatedAt: string;
  teamAssigned: {
    teamName: string;
    colorCode: string;
  }
  assignedAt:string
}

export interface LeadsResponse {
  data: Leads[];
  meta: {
    page: number;
    total: number;
    totalPages: number;
  }
}

export interface UpdateReferredByInput {
  referrerEmail: string;
}

export type CreateLeadInput = Omit<
  Leads,
  | "id"
  | "uuid"
  | "createdAt"
  | "updatedAt"
  | "owner"
  | "teamAssigned"
  | "handler"
  | "ownerId"
  | "handlerId"
  | "teamAssignedId"
   | "assignedAt"
> & {
  ownerId?: number;
};