import { TransferRole } from '../enums/TransferRole';
import { IFirebaseDate } from './FirebaseData';

export interface ITransferLog {
  status: string;
  obs: string;
  role: TransferRole;
  createdAt: Date | IFirebaseDate;
}

export interface ITransfer {
  id?: string;
  userId: string;
  currentTeam: string;
  destinationTeam: string;
  currentFederation: string;
  destinationFederation: string;
  obs: string;
  status: string;
  transferData: IFirebaseDate;
  log: Array<ITransferLog>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
