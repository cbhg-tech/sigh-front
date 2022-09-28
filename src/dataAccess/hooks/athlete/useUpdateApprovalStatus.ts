import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUserApproval } from '../../../types/UserApproval';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function useUpdateApprovalStatus() {
  const queryClient = useQueryClient();

  async function put(data: IUserApproval) {
    const res = await athleteController.updateApprovalStatus(data);
    queryClient.invalidateQueries(['getApprovalList']);

    return res;
  }

  return useMutation(put);
}
