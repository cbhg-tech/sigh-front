import { useQuery } from '@tanstack/react-query';
import { DashboardController } from '../../controllers/dashboard.controller';

const dashboardController = new DashboardController();

export function useGetDashboardLatestAthletes() {
  async function getLatestAthletes() {
    return dashboardController.getLatestAthletes();
  }

  return useQuery(['getLatestAthletes'], () => getLatestAthletes(), {
    refetchOnWindowFocus: false,
  });
}
