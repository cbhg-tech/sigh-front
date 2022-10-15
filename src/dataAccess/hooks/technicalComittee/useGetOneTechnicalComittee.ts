import { useQuery } from '@tanstack/react-query';
import { TechnicalComitteeController } from '../../controllers/technicalComittee.controller';

const technicalComitteeController = new TechnicalComitteeController();

export function useGetOneTechnicalComittee(id?: string) {
  async function getList(i: string) {
    return technicalComitteeController.getOne(i);
  }

  return useQuery(['getAllTechnicalComittee', id], () => getList(id!), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
