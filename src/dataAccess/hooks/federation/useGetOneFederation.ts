import { useQuery } from '@tanstack/react-query';
import { FederationController } from '../../controllers/federation.controller';

const federationController = new FederationController();

export function useGetOneFederation(id?: string) {
  async function getOne(id: string) {
    return federationController.getOne(id);
  }

  return useQuery(['getOneFederation', id], () => getOne(id!), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
