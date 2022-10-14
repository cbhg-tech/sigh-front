import { IFederation } from './Federation';
import { ITeam } from './Team';

export interface IPartnerProjectCofederationRelated {
  name: string;
}

export interface IPartnerProject {
  id?: string;
  name: string;
  initialDate: string;
  finalDate: string;
  practitioners: number;
  malePractitioners: number;
  femalePractitioners: number;
  ageGroup: string;
  relatedId: string;
  relatedType: 'Team' | 'Federation' | 'Cofederation';
  related: ITeam | IFederation | IPartnerProjectCofederationRelated;
  contact: {
    phone: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
