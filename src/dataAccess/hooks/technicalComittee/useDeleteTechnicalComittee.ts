import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TechnicalComitteeController } from '../../controllers/technicalComittee.controller';

const technicalComitteeController = new TechnicalComitteeController();

export function useDeleteTechnicalComittee() {
  const queryClient = useQueryClient();

  async function deleteTeam(id: string) {
    await technicalComitteeController.delete(id);
    await queryClient.invalidateQueries(['getAllTechnicalComittee']);
  }

  return useMutation(deleteTeam);
}
