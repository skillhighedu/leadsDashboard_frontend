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
  ticketAmount?: number;
  preferredLanguage?: string;
  reason?: string | null;
  referredBy?: string | null;
  ownerId?: number | null;
  teamAssignedId?: number | null;
  handlerId?: number | null;
  hadReferred: boolean;
  upFrontFee: number;
  remainingFee: number;
  batch: string;
  handler?: {
    name: string;
  };
  owner?: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  teamAssigned: {
    teamName: string;
    colorCode: string;
  };
  assignedAt: string;

  comment?: string;
  isSelfGen?: boolean;
}

export interface LeadsResponse {
  data: Leads[];
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
}

export interface SkippedLead {
  row: {
    name: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
    graduationYear?: string;
    branch?: string;
    college?: string;
    domain?: string;
    preferredLanguage?: string;
    hadReferred?: boolean;
    batch?: string;
    [key: string]: string | number | boolean | undefined;
  };
  reason: string;
}

export interface UploadLeadsResponse {
  insertedLeads: Leads[];
  insertedLeadsCount: number;
  skippedLeads: SkippedLead[];
  skippedLeadsCount: number;
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

export type payload = {
  employee: {
    name: string;
    id: number;
    teamId: number | null;
  };
  range: {
    from: string;
    to: string;
  };
  totals: {
    selfGenTrueCount: number;
    selfGenFalseCount: number;
    totalLeads: number;
    totalGeneratedAmount: number;
    totalProjectedAmount: number;
    totalTicketAmount: number;
  };
  selfGenStatusCounts: {
    [k: string]: number;
  };

  statuses: {
    status: string;
    count: number;
    selfGenCount: number;
    totalTicketAmount: number;
    generatedAmount: number;
    projectedAmount: number;
  }[];
};

export type SelfLeadTotals = {
  selfGenTrueCount: number;
  selfGenFalseCount: number;
  totalLeads: number;
  totalGeneratedAmount: number;
  totalProjectedAmount: number;
  totalTicketAmount: number;
};

export type SelfLeadStatusSummary = {
  status: string;
  count: number;
  selfGenCount: number;
  totalTicketAmount: number;
  generatedAmount: number;
  projectedAmount: number;
};

export type SelfLeadAnalyticsEmployee = {
  name: string;
  id: number;
  teamId: number | null;
};

export type SelfLeadAnalyticsSummaryResponse = {
  employee: SelfLeadAnalyticsEmployee;
  range: {
    from: string;
    to: string;
  };
  totals: SelfLeadTotals;
  selfGenStatusCount: Record<string, number>;
  statuses: SelfLeadStatusSummary[];
};

export type SelfLeadAnalyticsDailyItem = {
  day: string;
  totals: Omit<SelfLeadTotals, "selfGenFalseCount"> & {
    selfGenTrueCount: number;
  };
  selfGenStatusCounts: Record<string, number>;
  statuses: Record<
    string,
    {
      count: number;
      selfGenCount: number;
      generatedAmount: number;
      projectedAmount: number;
      totalTicketAmount: number;
    }
  >;
};

export type SelfLeadAnalyticsDailyResponse = {
  employee: SelfLeadAnalyticsEmployee;
  range: { from: string; to: string };
  totals: SelfLeadTotals;
  selfGenStatusCounts: Record<string, number>;
  daily: SelfLeadAnalyticsDailyItem[];
};



export type SelfAnalticsMode = "summary" | "day";
