import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../../../app/FirebaseConfig';
import { useGlobal } from '../../../contexts/global.context';
import { Status } from '../../../enums/Status';
import {
  AthleteController,
  IUpdateAthlete,
} from '../../controllers/athlete.controller';

const athleteController = new AthleteController();

export function usePutAthlete() {
  const { user } = useGlobal();
  const queryClient = useQueryClient();

  async function put(data: IUpdateAthlete) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-non-null-assertion
    data.userId = auth.currentUser!.uid;

    // eslint-disable-next-line no-param-reassign
    if (!data.name) data.name = user?.name;

    const res = await athleteController.put(data);

    if (user?.status === Status.REJECTED) {
      await athleteController.reopenApprovalStatus(user.id);
    }

    queryClient.invalidateQueries(['getAthletes']);
    queryClient.invalidateQueries(['getCurrentUser']);

    return res;
  }

  return useMutation(put);
}
