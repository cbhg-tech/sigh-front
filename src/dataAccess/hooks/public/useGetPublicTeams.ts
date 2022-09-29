import { useQuery } from '@tanstack/react-query';
import { PublicController } from '../../controllers/public.controller';

const publicController = new PublicController();

async function getTeams() {
  return publicController.getTeams();
}

export function useGetPublicTeams() {
  return useQuery(['getPublicTeams'], () => getTeams(), {
    refetchOnWindowFocus: false,
  });
}
