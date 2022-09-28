import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamController } from '../../controllers/team.controller';

const teamController = new TeamController();

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  async function deleteTeam(id: string) {
    const res = await teamController.delete(id);
    queryClient.invalidateQueries(['getTeams']);

    return res;
  }

  return useMutation(deleteTeam);
}
