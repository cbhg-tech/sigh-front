import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../app/FirebaseConfig';

export interface IAuthData {
  email: string;
  password: string;
}
export class AuthController {
  public async authenticate(data: IAuthData) {
    const { email, password } = data;

    await signInWithEmailAndPassword(auth, email, password);
  }

  public async logout() {
    await signOut(auth);
  }
}
