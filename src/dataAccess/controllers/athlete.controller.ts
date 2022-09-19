import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../app/FirebaseConfig';
import { Roles } from '../../enums/Roles';
import { Status } from '../../enums/Status';
import { IUser } from '../../types/User';

export interface ICreateAthlete
  extends Omit<IUser, 'id' | 'status' | 'role' | 'photo' | 'federation'> {
  password: string;
  birthDate: string;
}

export class AthleteController {
  public async create(data: ICreateAthlete) {
    const { email, name, password, team, birthDate } = data;

    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const athleteProfile = await addDoc(collection(db, 'athletes'), {
      userId: user.uid,
      birthDate,
    });

    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      role: Roles.USER,
      status: Status.PENDING,
      team,
      athleteProfile: athleteProfile.id,
    });
  }
}
