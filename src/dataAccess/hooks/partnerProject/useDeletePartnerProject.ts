import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PartnerProjectController } from '../../controllers/partnerProject.controller';

const partnerProjectController = new PartnerProjectController();

export function useDeletePartnerProject() {
  const queryClient = useQueryClient();

  async function disableUser(id: string): Promise<void> {
    await partnerProjectController.delete(id);
    queryClient.invalidateQueries(['getAllPartnerProjects']);
  }

  return useMutation(disableUser);
}
