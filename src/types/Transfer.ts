import { Roles } from '../enums/Roles';

export interface ITransferLog {
  status: string;
  message: string;
  role: Roles;
}

export interface ITransfer {
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
