export interface IPublicData {
  list: Array<{
    id: string;
    federationId?: string;
    name: string;
    logoUrl?: string;
  }>;
}
