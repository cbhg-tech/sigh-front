import { useQuery } from '@tanstack/react-query';
import { TechnicalComitteeController } from '../../controllers/technicalComittee.controller';

const technicalComitteeController = new TechnicalComitteeController();

export function useGetAllTechnicalComittee() {
  async function getList() {
    return technicalComitteeController.list();
  }

  return useQuery(['getAllTechnicalComittee'], () => getList(), {
    refetchOnWindowFocus: false,
  });
}
