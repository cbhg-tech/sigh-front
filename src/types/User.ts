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
  relatedType: 'team' | 'federation';
  related?: ITeam | IFederation;
  role: string;
  status: string;
  photoUrl?: string;
  document?: string;
  athleteProfile?: IAthlete;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
