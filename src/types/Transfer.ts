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
    photoUrl?: string;
  };
  currentTeam: string;
  currentTeamLogoUrl?: string;
  currentTeamId: string;
  destinationTeam: string;
  destinationTeamLogoUrl?: string;
  destinationTeamId: string;
  obs: string;
  status: string;
  transferData: string;
  log: Array<ITransferLog>;
}
