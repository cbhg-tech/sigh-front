import { useMutation, useQueryClient } from 'react-query';
import { TeamController, ICreateTeam } from '../../controllers/team.controller';

const teamController = new TeamController();

export function useCreateTeam() {
  const queryClient = useQueryClient();

  async function create(data: ICreateTeam) {
    const res = await teamController.create(data);
    queryClient.invalidateQueries('getTeams');

    return res;
  }

  return useMutation(create);
}
