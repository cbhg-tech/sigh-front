import { TransferRole } from '../enums/TransferRole';
import { IFirebaseDate } from './FirebaseData';
import { ITeam } from './Team';
import { IFederation } from './Federation';
import { IUser } from './User';

export interface ITransferLog {
  status: string;
  obs: string;
  role: TransferRole;
  createdAt: Date | IFirebaseDate;
}

export interface ITransfer {
  id?: string;
  userId: string;
  user?: IUser;
  currentTeamId: string;
  currentTeam?: ITeam;
  destinationTeamId: string;
  destinationTeam?: ITeam;
  currentFederationId: string;
  currentFederation?: IFederation;
  destinationFederationId: string;
  destinationFederation?: IFederation;
  obs: string;
  status: string;
  transferData: string;
  log: Array<ITransferLog>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
