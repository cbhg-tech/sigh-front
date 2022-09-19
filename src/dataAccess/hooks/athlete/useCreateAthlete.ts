import { useMutation } from 'react-query';
import {
  AthleteController,
  ICreateAthlete,
} from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function useCreateAthlete() {
  async function create(data: ICreateAthlete): Promise<void> {
    await athleteController.create(data);
  }

  return useMutation(create);
}
