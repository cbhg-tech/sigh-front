export interface IUser {
  id: string;
  name: string;
  email: string;
  team?: string;
  federation?: string;
  role: string;
  status: string;
  photo?: string;
  athleteProfile?: string;
}
