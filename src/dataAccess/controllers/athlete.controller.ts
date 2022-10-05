/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../app/FirebaseConfig';
import { Roles } from '../../enums/Roles';
import { Status } from '../../enums/Status';
import { IAthletesDocuments } from '../../pages/Athletes/Register/register.context';
import { validateIfDocumentExist } from '../../services/validateIfDocumentExists';
import { IAthlete } from '../../types/Athlete';
import { IUser } from '../../types/User';
import { IUserApproval } from '../../types/UserApproval';
import { UploadFile } from '../../utils/uploadFile';

export interface ICreateAthlete
  extends Omit<
    IUser,
    'id' | 'status' | 'role' | 'photo' | 'federation' | 'document'
  > {
  password: string;
  birthDate: string;
  document: string;
}

export interface IUpdateAthlete extends IAthlete {
  userId?: string;
  documentFiles?: IAthletesDocuments;
}

export class AthleteController {
  public async create(data: ICreateAthlete) {
    const { email, name, password, team, birthDate, document } = data;

    await validateIfDocumentExist(document);

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
      document,
    });

    await setDoc(doc(db, 'userApproval', user.uid), {
      status: Status.PENDING,
      registerDate: new Date(),
      team,
      name,
      teamApproved: false,
      cbhgApproved: false,
      createdAt: new Date(),
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

  public async put(data: Partial<IUpdateAthlete>) {
    let commitmentTermUrl = '';
    let medicalCertificateUrl = '';
    let nocUrl = '';
    let personalDocumentUrl = '';

    const { userId } = data;

    if (!userId) throw new Error('userId is required');

    if (data.documentFiles) {
      const { commitmentTerm, medicalCertificate, noc, personalDocument } =
        data.documentFiles;

      if (commitmentTerm) {
        commitmentTermUrl = await UploadFile(
          `athletes/${userId}/documents/commitmentTerm`,
          commitmentTerm,
        );
      }

      if (medicalCertificate) {
        medicalCertificateUrl = await UploadFile(
          `athletes/${userId}/documents/medicalCertificate`,
          medicalCertificate,
        );
      }

      if (noc) {
        nocUrl = await UploadFile(`athletes/${userId}/documents/noc`, noc);
      }

      if (personalDocument) {
        personalDocumentUrl = await UploadFile(
          `athletes/${userId}/documents/personalDocument`,
          personalDocument,
        );
      }

      delete data.documentFiles;

      data.documents!.commitmentTerm = commitmentTermUrl;
      data.documents!.medicalCertificate = medicalCertificateUrl;
      data.documents!.noc = nocUrl;
      data.documents!.personalDocument = personalDocumentUrl;
    }

    delete data.userId;

    data.address!.country = 'BR';

    await updateDoc(doc(db, 'users', userId), {
      athleteProfile: {
        ...data,
      },
    });

    await updateDoc(doc(db, 'userApproval', userId), {
      gender: data.gender,
    });
  }

  public async getApprovalList(team?: string) {
    let q = query(
      collection(db, 'userApproval'),
      where('status', '==', Status.PENDING),
      limit(20),
    );

    if (team) {
      q = query(
        collection(db, 'userApproval'),
        where('status', '==', Status.PENDING),
        where('team.id', '==', team),
        limit(20),
      );
    }

    const users = await getDocs(q);

    const athletes = [] as Array<IUserApproval>;

    users.forEach(doc => {
      // @ts-ignore
      athletes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return athletes;
  }

  public async getApprovalDetails(userId: string) {
    const userDetailsQuery = await getDoc(doc(db, 'users', userId));
    const approvalDetailQuery = await getDoc(doc(db, 'userApproval', userId));

    const userDetails = {
      id: userDetailsQuery.id,
      ...userDetailsQuery.data(),
    } as IUser;
    const approvalDetails = {
      id: approvalDetailQuery.id,
      ...approvalDetailQuery.data(),
    } as IUserApproval;

    return {
      user: userDetails,
      approval: approvalDetails,
    };
  }

  public async updateApprovalStatus(data: IUserApproval) {
    const { id, status } = data;

    await updateDoc(doc(db, 'userApproval', id), {
      ...data,
    });

    if (status !== Status.PENDING) {
      await updateDoc(doc(db, 'users', id), {
        status,
      });
    }
  }

  public async reopenApprovalStatus(id: string) {
    await updateDoc(doc(db, 'userApproval', id), {
      status: Status.PENDING,
      updatedAt: new Date(),
    });
  }
}
