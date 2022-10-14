import { IFirebaseDate } from './FirebaseData';
import { Roles } from '../enums/Roles';
import { ITeam } from './Team';
import { Status } from '../enums/Status';

interface IUserApprovalLog {
  note: string;
  author: string | Roles;
  status: Status;
  createdAt: Date;
}

export interface IUserApproval {
  id: string;
  name: string;
  registerDate: string;
  teamId: string;
  team?: ITeam;
  status: string;
  gender: string;
  teamApproved: boolean;
  federationApproved: boolean;
  cbhgApproved: boolean;
  log: Array<IUserApprovalLog>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
