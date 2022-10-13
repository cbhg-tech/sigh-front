import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IConfigs } from '../../types/Configs';

export class ConfigsController {
  public async get(): Promise<IConfigs> {
    const docSnap = await getDoc(doc(db, 'public', 'configs'));

    return { ...docSnap.data() } as IConfigs;
  }
}
