import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../../../app/FirebaseConfig';
import {
  AthleteController,
  IUpdateAthlete,
} from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function usePutAthlete() {
  const queryClient = useQueryClient();

  async function put(data: IUpdateAthlete) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-non-null-assertion
    data.userId = auth.currentUser!.uid;

    const res = await athleteController.put(data);
    queryClient.invalidateQueries(['getAthletes']);
    queryClient.invalidateQueries(['getCurrentUser']);

    return res;
  }

  return useMutation(put);
}
