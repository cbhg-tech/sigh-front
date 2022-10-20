import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PartnerProjectController,
  IUpdatePartnerProject,
} from '../../controllers/partnerProject.controller';

const partnerProjectController = new PartnerProjectController();

export function useUpdatePartnerProject() {
  const queryClient = useQueryClient();

  async function update(data: IUpdatePartnerProject) {
    await partnerProjectController.update(data);
    await queryClient.invalidateQueries(['getAllPartnerProjects']);
  }

  return useMutation(update);
}
