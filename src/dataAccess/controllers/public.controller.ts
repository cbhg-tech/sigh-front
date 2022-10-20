import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IPublicData } from '../../types/PublicData';
import { ITotalizer } from '../../types/Totalizer';

export class PublicController {
  public async getTotalizer() {
    const docSnap = await getDoc(doc(db, 'public', 'totalizer'));

    return {
      ...docSnap.data(),
    } as ITotalizer;
  }

  public async getTeams() {
    const docSnap = await getDoc(doc(db, 'public', 'teams'));

    return {
      ...docSnap.data(),
    } as IPublicData;
  }

  public async getFederation() {
    const docSnap = await getDoc(doc(db, 'public', 'federations'));

    return {
      ...docSnap.data(),
    } as IPublicData;
  }
}
