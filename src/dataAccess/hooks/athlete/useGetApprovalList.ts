import { useQuery } from 'react-query';
import { IUserApproval } from '../../../types/UserApproval';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

async function getApprovalList(): Promise<IUserApproval[]> {
  return athleteController.getApprovalList();
}

export function useGetAppovalList() {
  return useQuery(['getApprovalList'], () => getApprovalList(), {
    refetchOnWindowFocus: false,
  });
}
