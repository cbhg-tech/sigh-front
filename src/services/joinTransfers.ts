import { doc, getDoc } from 'firebase/firestore';
import { ITransfer } from '../types/Transfer';
import { db } from '../app/FirebaseConfig';
import { IUser } from '../types/User';
import { IFederation } from '../types/Federation';
import { ITeam } from '../types/Team';

export async function joinTransfer(transfer: ITransfer) {
  const {
    userId,
    currentFederationId,
    currentTeamId,
    destinationTeamId,
    destinationFederationId,
  } = transfer;

  const user = await getDoc(doc(db, 'users', userId));
  const currentFederation = await getDoc(
    doc(db, 'federations', currentFederationId),
  );
  const currentTeam = await getDoc(doc(db, 'teams', currentTeamId));
  const destinationTeam = await getDoc(doc(db, 'teams', destinationTeamId));
  const destinationFederation =
    destinationFederationId !== currentFederationId
      ? await getDoc(doc(db, 'federations', destinationFederationId))
      : undefined;

  return {
    ...transfer,
    user: user.data() as IUser,
    currentFederation: currentFederation.data() as IFederation,
    currentTeam: currentTeam.data() as ITeam,
    destinationTeam: destinationTeam.data() as ITeam,
    destinationFederation: destinationFederation
      ? (destinationFederation.data() as IFederation)
      : (currentFederation.data() as IFederation),
  };
}
