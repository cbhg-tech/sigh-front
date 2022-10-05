import { useQuery } from '@tanstack/react-query';
import { IUser } from '../../../types/User';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function useGetAthletesReport() {
  async function getAthletes(): Promise<IUser[]> {
    return athleteController.listAll();
  }

  return useQuery(['getAthletesReport'], () => getAthletes(), {
    refetchOnWindowFocus: false,
  });
}
