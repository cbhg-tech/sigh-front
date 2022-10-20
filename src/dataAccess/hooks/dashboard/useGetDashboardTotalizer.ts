import { useQuery } from '@tanstack/react-query';
import { PublicController } from '../../controllers/public.controller';

const publicController = new PublicController();

export function useGetDashboardTotalizer() {
  async function get() {
    return publicController.getTotalizer();
  }

  return useQuery(['getDashboardTotalizer'], () => get(), {
    refetchOnWindowFocus: false,
  });
}
