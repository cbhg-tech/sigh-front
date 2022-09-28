export interface IAthlete {
  document: string;
  phone: number;
  birthDate: string;
  country: string;
  gender: string;
  description: string;
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
