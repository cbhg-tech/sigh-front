import {
  collection,
  query,
  getDocs,
  limit,
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../app/FirebaseConfig';
import { IUser } from '../../types/User';
import { Status } from '../../enums/Status';

export interface ICreateUser extends Omit<IUser, 'id' | 'status'> {
  email: string;
  password: string;
}

export class UserController {
  public async list() {
    const q = query(collection(db, 'users'), limit(20));
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

  public async create(data: ICreateUser) {
    const { email, password, name, role, team } = data;

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
      team,
    });
  }

  public async disable(id: string) {
    await updateDoc(doc(db, 'users', id), {
      status: Status.INACTIVE,
    });
  }
}
