import { IFirebaseDate } from './FirebaseData';
import { IFederation } from './Federation';
import { IUser } from './User';

export interface ITeam {
  id: string;
  name: string;
  initials: string;
  email: string;
  url: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federationId: string;
  federation?: IFederation;
  logo: string;
  electionMinutes: string;
  presidentDocument: string;
  teamDocument: string;
  usersList: string[];
  users?: Array<IUser>;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
