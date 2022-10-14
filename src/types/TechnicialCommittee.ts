import { ITeam } from './Team';

export interface ITechnicialCommittee {
  id?: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: string;
  email: string;
  documentFile: string;
  relatedId: string;
  related?: ITeam;
  createdAt: string;
  updatedAt: string;
}
