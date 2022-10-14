export interface IProjectPartner {
  id?: string;
  name: string;
  initialDate: string;
  finalDate: string;
  practitioners: number;
  malePractitioners: number;
  femalePractitioners: number;
  ageGroup: string;
  contact: {
    phone: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
