import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PartnerProjectController,
  ICreatePartnerProject,
} from '../../controllers/partnerProject.controller';

const partnerProjectController = new PartnerProjectController();

export function useCreateProjectPartner() {
  const queryClient = useQueryClient();

  async function create(data: ICreatePartnerProject): Promise<void> {
    await partnerProjectController.create(data);
    await queryClient.invalidateQueries(['getAllPartnerProjects']);
  }

  return useMutation(create);
}
