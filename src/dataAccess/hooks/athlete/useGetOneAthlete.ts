import { useQuery } from '@tanstack/react-query';
import { AthleteController } from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function useGetOneAthlete(id?: string) {
  async function getOne(id: string) {
    return athleteController.getOne(id);
  }

  return useQuery(['getOneAthlete', id], () => getOne(id!), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
