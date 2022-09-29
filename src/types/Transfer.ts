import { TransferRole } from '../enums/TransferRole';

export interface ITransferLog {
  status: string;
  obs: string;
  role: TransferRole;
}

export interface ITransfer {
  id?: string;
  user: {
    id: string;
    name: string;
  };
  currentTeam: string;
  currentTeamId: string;
  destinationTeam: string;
  destinationTeamId: string;
  obs: string;
  status: string;
  transferData: string;
  log: Array<ITransferLog>;
}
