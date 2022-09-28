import { IAthlete } from './Athlete';

export interface IUser {
  id: string;
  name: string;
  email: string;
  team?: {
    id: string;
    name: string;
  };
  federation?: string;
  role: string;
  status: string;
  photo?: string;
  athleteProfile?: IAthlete;
}
