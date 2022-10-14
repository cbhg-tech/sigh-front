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
import { ITeam } from '../../types/Team';

export interface ICreateAthlete
  extends Omit<
    IUser,
    | 'id'
    | 'status'
    | 'role'
    | 'photo'
    | 'federation'
    | 'document'
    | 'createdAt'
    | 'updatedAt'
  > {
  password: string;
  birthDate: string;
  document: string;
}

export interface IUpdateAthlete extends Omit<IAthlete, 'birthDate'> {
  userId?: string;
  documentFiles?: IAthletesDocuments;
  birthDate: Date;
}

export class AthleteController {
  public async create(data: ICreateAthlete) {
    const {
      email,
      name,
      password,
      relatedName,
      relatedId,
      relatedType,
      birthDate,
      document,
    } = data;

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
      relatedName,
      relatedId,
      relatedType,
      athleteProfile: {
        birthDate: new Date(birthDate),
      },
      document,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await setDoc(doc(db, 'userApproval', user.uid), {
      status: Status.PENDING,
      registerDate: new Date(),
      teamId: relatedId,
      name,
      log: [],
      teamApproved: false,
      federationApproved: false,
      cbhgApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private async getRelatedData(list: IUser[]) {
    const relatedReads = list.map(async athlete =>
      getDoc(doc(db, 'teams', athlete.relatedId!)),
    );
    const relatedResults = await Promise.all(relatedReads);

    return list.map(athlete => {
      const related = relatedResults.find(rr => rr.id === athlete.relatedId);

      return {
        ...athlete,
        related: related?.data() as ITeam,
      };
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

    return this.getRelatedData(athletes);
  }

  public async listAll() {
    const q = query(collection(db, 'users'), where('role', '==', Roles.USER));

    const users = await getDocs(q);

    const athletes = [] as Array<IUser>;

    users.forEach(doc => {
      // @ts-ignore
      athletes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return this.getRelatedData(athletes);
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
      updatedAt: new Date(),
    });

    await updateDoc(doc(db, 'userApproval', userId), {
      gender: data.gender,
      updatedAt: new Date(),
    });
  }

  public async getApprovalList(team?: string) {
    let q = query(
      collection(db, 'userApproval'),
      where('status', '!=', Status.ACTIVE),
      limit(20),
    );

    if (team) {
      q = query(
        collection(db, 'userApproval'),
        where('status', '!=', Status.ACTIVE),
        where('teamId', '==', team),
        limit(20),
      );
    }

    const usersTransfers = await getDocs(q);

    const userApproval = [] as Array<IUserApproval>;

    usersTransfers.forEach(doc => {
      // @ts-ignore
      userApproval.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const relatedReads = userApproval.map(async ua =>
      getDoc(doc(db, 'teams', ua.teamId)),
    );
    const relatedResults = await Promise.all(relatedReads);

    return userApproval.map(ua => {
      const related = relatedResults.find(rr => rr.id === ua.teamId);

      return {
        ...ua,
        team: related?.data() as ITeam,
      };
    });
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
      updatedAt: new Date(),
    });

    if (status !== Status.PENDING) {
      await updateDoc(doc(db, 'users', id), {
        status,
        updatedAt: new Date(),
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
