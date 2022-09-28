import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IPublicTeams } from '../../types/PublicTeams';

export class PublicController {
  public async getTeams() {
    const docSnap = await getDoc(doc(db, 'public', 'teams'));

    return {
      ...docSnap.data(),
    } as IPublicTeams;
  }
}
