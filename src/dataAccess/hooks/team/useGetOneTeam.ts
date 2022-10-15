import { useQuery } from '@tanstack/react-query';
import { TeamController } from '../../controllers/team.controller';

const teamController = new TeamController();

export function useGetOneTeam(id?: string) {
  async function getOne(id: string) {
    return teamController.getOne(id);
  }

  return useQuery(['getOneTeam', id], () => getOne(id!), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
