import { Status } from '../enums/Status';
import { IUser } from '../types/User';

export function checkIfAthleteIsActiveOrPending(user?: IUser) {
  if (!user) return 'Pending';

  if (user.status === Status.PENDING) return 'Pending';

  if (
    user.status === Status.ACTIVE &&
    user.athleteProfile?.termsAccepted &&
    user.athleteProfile?.dataUseAccepted &&
    user.athleteProfile.imageUseAccepted
  ) {
    return 'Active';
  }

  return 'Pending';
}
