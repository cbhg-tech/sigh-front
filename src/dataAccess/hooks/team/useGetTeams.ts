import { useQuery } from '@tanstack/react-query';
import { TeamController } from '../../controllers/team.controller';

const teamController = new TeamController();

async function getTeams() {
  return teamController.list();
}

export function useGetTeams() {
  return useQuery(['getTeams'], () => getTeams(), {
    refetchOnWindowFocus: false,
  });
}
