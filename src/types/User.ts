import { IAthlete } from './Athlete';
import { IFirebaseDate } from './FirebaseData';

export interface IUser {
  id: string;
  name: string;
  email: string;
  related: string;
  team?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  federation?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  role: string;
  status: string;
  photoUrl?: string;
  document?: string;
  athleteProfile?: IAthlete;
  createdAt: Date | IFirebaseDate;
  updatedAt: Date | IFirebaseDate;
}
