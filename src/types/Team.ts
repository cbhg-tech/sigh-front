export interface ITeam {
  id: string;
  name: string;
  initials: string;
  email: string;
  url: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federation: {
    id: string;
    name: string;
  };
  logo: string;
  electionMinutes: string;
  presidentDocument: string;
  federationDocument: string;
}
