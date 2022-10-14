import { useQuery } from '@tanstack/react-query';
import { PartnerProjectController } from '../../controllers/partnerProject.controller';

const partnerProjectController = new PartnerProjectController();

export function useGetAllPartnerProjects() {
  async function getList() {
    return partnerProjectController.list();
  }

  return useQuery(['getAllPartnerProjects'], () => getList(), {
    refetchOnWindowFocus: false,
  });
}
