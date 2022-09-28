import { useQuery } from 'react-query';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

async function getApprovalDetails(id: string) {
  return athleteController.getApprovalDetails(id);
}

export function useGetAppovalDetails(id?: string) {
  return useQuery(
    ['getApprovalDetails', id],
    () => getApprovalDetails(id || ''),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    },
  );
}
