import { useQuery } from '@tanstack/react-query';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

async function getAthletes() {
  return athleteController.list();
}

export function useGetAthletes() {
  return useQuery(['getAthletes'], () => getAthletes(), {
    refetchOnWindowFocus: false,
  });
}
