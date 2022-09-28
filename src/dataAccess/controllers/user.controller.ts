import {
  collection,
  query,
  getDocs,
  limit,
  setDoc,
  doc,
  updateDoc,
  where,
  getDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../app/FirebaseConfig';
import { IUser } from '../../types/User';
import { Status } from '../../enums/Status';
import { Roles } from '../../enums/Roles';

export interface ICreateUser extends Omit<IUser, 'id' | 'status'> {
  email: string;
  password: string;
}

export class UserController {
  public async list() {
    const q = query(
      collection(db, 'users'),
      where('role', '!=', Roles.USER),
      limit(20),
    );
    const querySnapshot = await getDocs(q);

    const result = [] as Array<IUser>;

    querySnapshot.forEach(d =>
      // @ts-ignore
      result.push({
        id: d.id,
        ...d.data(),
      }),
    );

    return result;
  }

  public async getCurrent() {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('UserId not found');
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as IUser;
    }

    throw new Error('User not found');
  }

  public async create(data: ICreateUser) {
    const { email, password, name, role, team, federation } = data;

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      role,
      status: Status.ACTIVE,
      related: team?.name || federation?.name,
      team: team || {},
      federation: federation || {},
    });
  }

  public async disable(id: string) {
    await updateDoc(doc(db, 'users', id), {
      status: Status.INACTIVE,
    });
  }
}
