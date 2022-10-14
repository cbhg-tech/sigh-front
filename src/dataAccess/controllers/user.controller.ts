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
import { validateIfDocumentExist } from '../../services/validateIfDocumentExists';

export interface ICreateUser
  extends Omit<IUser, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
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
      const user = {
        ...docSnap.data(),
        id: docSnap.id,
      } as IUser;

      const related = await getDoc(doc(db, user.relatedType!, user.relatedId!));

      return {
        ...user,
        related: related.data(),
      } as IUser;
    }

    throw new Error('User not found');
  }

  public async create(data: ICreateUser) {
    const {
      email,
      password,
      name,
      role,
      relatedName,
      relatedType,
      relatedId,
      document,
    } = data;

    if (role === Roles.USER && document) {
      await validateIfDocumentExist(document);
    }

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
      relatedName,
      relatedType,
      relatedId,
      document: document || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async put(data: Partial<IUser>) {
    // eslint-disable-next-line no-param-reassign
    delete data.related;

    await updateDoc(doc(db, 'users', data.id!), {
      ...data,
      updatedAt: new Date(),
    });
  }

  public async disable(id: string) {
    await updateDoc(doc(db, 'users', id), {
      status: Status.INACTIVE,
      updatedAt: new Date(),
    });
  }
}
