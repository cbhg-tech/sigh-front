import { ITeam } from './Team';
import { IFirebaseDate } from './FirebaseData';

export interface IFederation {
  id: string;
  name: string;
  initials: string;
  uf: string;
  email: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  logo: string;
  electionMinutes: string;
  presidentDocument: string;
  federationDocument: string;
  teams?: Array<ITeam>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
