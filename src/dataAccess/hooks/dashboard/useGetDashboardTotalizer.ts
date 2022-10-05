import { useQuery } from '@tanstack/react-query';
import { DashboardController } from '../../controllers/dashboard.controller';

const dashboardController = new DashboardController();

export function useGetDashboardTotalizer() {
  async function getTotalizer() {
    return dashboardController.getTotalizer();
  }

  return useQuery(['getDashboardTotalizer'], () => getTotalizer(), {
    refetchOnWindowFocus: false,
  });
}
