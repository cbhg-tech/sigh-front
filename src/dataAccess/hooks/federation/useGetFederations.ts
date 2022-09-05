import { useQuery } from 'react-query';
import { FederationController } from '../../controllers/federation.controller';

const federationController = new FederationController();

async function getFederations() {
  return federationController.list();
}

export function useGetFederations() {
  return useQuery(['getFederations'], () => getFederations(), {
    refetchOnWindowFocus: false,
  });
}
