import { useQuery } from '@tanstack/react-query';
import { IUserApproval } from '../../../types/UserApproval';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

async function getApprovalList(team?: string): Promise<IUserApproval[]> {
  return athleteController.getApprovalList(team);
}

export function useGetAppovalList(team?: string) {
  return useQuery(['getApprovalList', team], () => getApprovalList(team), {
    refetchOnWindowFocus: false,
  });
}
