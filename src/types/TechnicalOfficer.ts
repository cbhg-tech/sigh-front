import { ITeam } from './Team';

export interface ITechnicalOfficer {
  id?: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: string;
  email: string;
  documentFile: string;
  charge?: string;
  address?: string;
  relatedId: string;
  related?: ITeam;
  createdAt: string;
  updatedAt: string;
}
