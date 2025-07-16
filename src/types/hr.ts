export type staffLoginsRecord = {
    employeeRecordUuid: string
    employeeId: number;
    name: string;
    loginTime: Date;
    logoutTime: Date | null;
    date: string;
    dayStatus: "PRESENT" | "FULL" | "HALF" | "ABSENT";
    employeeRole: string
}

export type staffLoginsResponse =  {
    data: staffLoginsRecord[];
    count: number
}

export type LeaveStatus = "PENDING" | "APPROVED";