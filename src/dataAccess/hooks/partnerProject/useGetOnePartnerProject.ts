import { useQuery } from '@tanstack/react-query';
import { PartnerProjectController } from '../../controllers/partnerProject.controller';

const partnerProjectController = new PartnerProjectController();

export function useGetOnePartnerProject(id?: string) {
  async function getOne(id: string) {
    return partnerProjectController.getOne(id);
  }

  return useQuery(['getOnePartnerProject', id], () => getOne(id!), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
