import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TechnicalComitteeController,
  IUpdateTechnicalComittee,
} from '../../controllers/technicalComittee.controller';

const technicalComitteeController = new TechnicalComitteeController();

export function useUpdateTechnicalComittee() {
  const queryClient = useQueryClient();

  async function update(data: IUpdateTechnicalComittee) {
    await technicalComitteeController.update(data);
    await queryClient.invalidateQueries(['getAllTechnicalComittee']);
  }

  return useMutation(update);
}
