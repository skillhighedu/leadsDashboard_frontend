

 export type LeaveApplicationPayload = {
    fromDate: Date,
    toDate: Date,
    leaveType: string,
    reason: string
}

export type LeaveApplicationResponse = {
  id: number;
  uuid: string;
  employeeId: number;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type LeaveResponse = {
  id: number;
  uuid: string;
  employeeId: number;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  role: string
};

export type LeavesResponse = {
    data: LeaveResponse[];
    count: number;
}

export type UpdateLeaveStatusPayload = {
  status: "PENDING" | "APPROVED";
};

export type UpdatedLeaveResponse = {
  id: number;
  uuid: string;
  employeeId: number;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: "PENDING" | "APPROVED";
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
};
