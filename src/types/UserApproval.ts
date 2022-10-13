import { IFirebaseDate } from './FirebaseData';

interface IUserApprovalLog {
  note: string;
  createdAt: Date;
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
  log: Array<IUserApprovalLog>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
