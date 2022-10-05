import { useQuery } from '@tanstack/react-query';
import { DashboardController } from '../../controllers/dashboard.controller';

const dashboardController = new DashboardController();

export function useGetDashboardLatestTransfer() {
  async function getLatestTransfer() {
    return dashboardController.getLatestTransfers();
  }

  return useQuery(['getDashboardLatestTransfers'], () => getLatestTransfer(), {
    refetchOnWindowFocus: false,
  });
}
