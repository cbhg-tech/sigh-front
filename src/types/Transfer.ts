import { TransferRole } from '../enums/TransferRole';
import { IFirebaseDate } from './FirebaseData';
import { ITeam } from './Team';
import { IFederation } from './Federation';
import { IUser } from './User';
import { Status } from '../enums/Status';

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
  currentTeamStatus?: Status;
  currentTeamId: string;
  currentTeam?: ITeam;
  destinationTeamStatus?: Status;
  destinationTeamId: string;
  destinationTeam?: ITeam;
  currentFederationStatus?: Status;
  currentFederationId: string;
  currentFederation?: IFederation;
  destinationFederationStatus?: Status;
  destinationFederationId: string;
  destinationFederation?: IFederation;
  cbhgStatus?: Status;
  obs: string;
  status: string;
  transferData: string;
  log: Array<ITransferLog>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
