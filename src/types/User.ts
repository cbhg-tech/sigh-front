import { IAthlete } from './Athlete';

export interface IUser {
  id: string;
  name: string;
  email: string;
  related: string;
  team?: {
    id: string;
    name: string;
  };
  federation?: {
    id: string;
    name: string;
  };
  role: string;
  status: string;
  photo?: string;
  athleteProfile?: IAthlete;
}
