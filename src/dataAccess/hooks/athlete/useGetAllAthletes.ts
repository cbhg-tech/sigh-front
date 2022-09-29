import { useQuery } from '@tanstack/react-query';
import { IUser } from '../../../types/User';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

async function getAthletes(): Promise<IUser[]> {
  return athleteController.list();
}

export function useGetAthletes() {
  return useQuery(['getAthletes'], () => getAthletes(), {
    refetchOnWindowFocus: false,
  });
}
