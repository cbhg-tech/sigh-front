import {
  collection,
  query,
  getDocs,
  limit,
  setDoc,
  doc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../app/FirebaseConfig';
import { IUser } from '../../types/User';

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
      // TODO: Criar enum de status
      status: 'ACTIVE',
      team,
    });
  }

  public async delete(data: ICreateUser) {
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
      // TODO: Criar enum de status
      status: 'ACTIVE',
      team,
    });
  }
}
