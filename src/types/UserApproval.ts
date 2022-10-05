interface IUserApprovalLog {
  note: string;
  updatedAt: Date;
}

export interface IUserApproval {
  id: string;
  name: string;
  registerDate: Date;
  team: {
    id: string;
    name: string;
  };
  status: string;
  gender: string;
  teamApproved: boolean;
  cbhgApproved: boolean;
  logTeam?: string;
  logCbhg?: string;
}
