export interface IPublicTeams {
  list: Array<{
    id: string;
    federationId?: string;
    name: string;
  }>;
}
