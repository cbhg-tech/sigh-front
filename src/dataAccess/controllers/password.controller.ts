import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../app/FirebaseConfig';

export class PasswordController {
  public async forgot(email: string) {
    await sendPasswordResetEmail(auth, email);
  }
}
