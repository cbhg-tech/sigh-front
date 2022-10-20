import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamController, IPutTeam } from '../../controllers/team.controller';

const teamController = new TeamController();

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  async function update(data: IPutTeam) {
    const res = await teamController.update(data);
    queryClient.invalidateQueries(['getTeams']);

    return res;
  }

  return useMutation(update);
}
