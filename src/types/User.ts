import { IAthlete } from './Athlete';
import { IFirebaseDate } from './FirebaseData';
import { ITeam } from './Team';
import { IFederation } from './Federation';

export interface IUser {
  id: string;
  name: string;
  email: string;
  relatedName: string;
  relatedId: string;
  relatedType: 'team' | 'federation' | 'cofederation';
  related?: ITeam | IFederation;
  role: string;
  status: string;
  transfering: boolean;
  photoUrl?: string;
  document?: string;
  athleteProfile?: IAthlete;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
