import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
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

    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      role: Roles.USER,
      status: Status.PENDING,
      team,
      athleteProfile: {
        birthDate: new Date(birthDate),
      },
    });

    await setDoc(doc(db, 'userApproval', user.uid), {
      status: Status.PENDING,
      rergisterDate: new Date(),
      team,
      name,
    });
  }

  public async list() {
    const q = query(
      collection(db, 'users'),
      where('role', '==', Roles.USER),
      limit(20),
    );

    const users = await getDocs(q);

    const athletes = [] as Array<IUser>;

    users.forEach(doc => {
      // @ts-ignore
      athletes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return athletes;
  }
}
