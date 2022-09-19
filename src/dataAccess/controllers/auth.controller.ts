import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../app/FirebaseConfig';
import { Status } from '../../enums/Status';
import { IUser } from '../../types/User';

export interface IAuthData {
  email: string;
  password: string;
}
export class AuthController {
  public async authenticate(data: IAuthData) {
    const { email, password } = data;

    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const docSnap = await getDoc(doc(db, 'users', user.uid));

    if (!docSnap.exists()) {
      await signOut(auth);
    }

    const { status } = docSnap.data() as IUser;

    if (status === Status.INACTIVE) {
      await signOut(auth);

      throw new Error('Usuário inativo');
    }
  }

  public async logout() {
    await signOut(auth);
  }
}
