export interface IAthlete {
  registerNumber: number;
  phone: number;
  birthDate: string;
  nickname: string;
  country: string;
  gender: string;
  termsAccepted?: boolean;
  imageUseAccepted?: boolean;
  dataUseAccepted?: boolean;
  address: {
    country: string;
    city: string;
    state: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
  };
  documents: {
    rgNumber?: string;
    rgEmissionDate?: string;
    rgEmissionOrg?: string;
    personalDocument: string;
    noc: string;
    medicalCertificate: string;
    commitmentTerm: string;
  };
  hospitalData: {
    bloodType: string;
    allergies: string;
    chronicDiseases: string;
    medications: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
}
