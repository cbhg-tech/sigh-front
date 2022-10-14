import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TechnicalComitteeController,
  ICreateTechnicalComittee,
} from '../../controllers/technicalComittee.controller';

const technicalComitteeController = new TechnicalComitteeController();

export function useCreateTechnicalComittee() {
  const queryClient = useQueryClient();

  async function create(data: ICreateTechnicalComittee): Promise<void> {
    await technicalComitteeController.create(data);
    await queryClient.invalidateQueries(['getAllTechnicalComittee']);
  }

  return useMutation(create);
}
