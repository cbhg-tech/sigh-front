import { useQuery } from '@tanstack/react-query';
import { PublicController } from '../../controllers/public.controller';

const publicController = new PublicController();

async function getFederations() {
  return publicController.getFederation();
}

export function useGetPublicFederations() {
  return useQuery(['getPublicFederation'], () => getFederations(), {
    refetchOnWindowFocus: false,
  });
}
