import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  getDoc,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IPublicData } from '../../types/PublicData';
import { ITeam } from '../../types/Team';
import { UploadFile } from '../../utils/uploadFile';
import { IUser } from '../../types/User';
import { IFederation } from '../../types/Federation';

export interface ICreateTeam
  extends Omit<
    ITeam,
    | 'id'
    | 'logo'
    | 'federation'
    | 'electionMinutes'
    | 'presidentDocument'
    | 'teamDocument'
    | 'users'
    | 'usersList'
    | 'createdAt'
    | 'updatedAt'
  > {
  logo: File;
  presidentDocument: File;
  teamDocument: File;
  electionMinutes: File;
}

export class TeamController {
  public async list() {
    const q = query(collection(db, 'teams'));
    const querySnapshot = await getDocs(q);

    const result = [] as Array<ITeam>;

    querySnapshot.forEach(d =>
      // @ts-ignore
      result.push({
        id: d.id,
        ...d.data(),
      }),
    );

    const federationsReads = result.map(r =>
      getDoc(doc(db, 'federations', r.federationId)),
    );
    const federationsReuslts = await Promise.all(federationsReads);

    return result.map((r, i) => {
      const fed = federationsReuslts.find(f => f.id === r.federationId);

      return {
        ...r,
        federation: fed?.data(),
      };
    }) as Array<ITeam>;
  }

  public async getOne(id: string) {
    const res = await getDoc(doc(db, 'teams', id));

    const data = { ...res.data() } as ITeam;

    let userList: Array<IUser> = [];

    if (data.usersList.length > 0) {
      const users = data.usersList.map(async u => getDoc(doc(db, 'users', u)));
      const results = await Promise.all(users);

      userList = results.map(r => ({ id: r.id, ...r.data() } as IUser));
    }

    const federation = await getDoc(doc(db, 'federations', data.federationId));

    return {
      ...data,
      federation: federation.data() as IFederation,
      users: userList,
    } as ITeam;
  }

  public async create(data: ICreateTeam) {
    const {
      name,
      email,
      beginningOfTerm,
      endOfTerm,
      initials,
      presidentName,
      coachName,
      description,
      federationId,
      url,
      logo: logoFile,
      electionMinutes: electionMinutesFile,
      presidentDocument: presidentDocumentFile,
      teamDocument: teamDocumentFile,
    } = data;

    const { id } = await addDoc(collection(db, 'teams'), {
      name,
      email,
      beginningOfTerm,
      endOfTerm,
      initials,
      presidentName,
      coachName,
      description,
      federationId,
      url,
      usersList: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await updateDoc(doc(db, 'federations', federationId), {
      teams: arrayUnion(id),
    });

    const logo = await UploadFile(`teams/${id}/${logoFile.name}`, logoFile);
    const electionMinutes = await UploadFile(
      `teams/${id}/${electionMinutesFile.name}`,
      electionMinutesFile,
    );
    const presidentDocument = await UploadFile(
      `teams/${id}/${presidentDocumentFile.name}`,
      presidentDocumentFile,
    );
    const federationDocument = await UploadFile(
      `teams/${id}/${teamDocumentFile.name}`,
      teamDocumentFile,
    );

    await updateDoc(doc(db, 'teams', id), {
      logo,
      electionMinutes,
      presidentDocument,
      federationDocument,
    });

    await updateDoc(doc(db, 'public', 'teams'), {
      list: arrayUnion({
        id,
        name,
        federationId,
        logoUrl: logo,
      }),
    });

    await updateDoc(doc(db, 'public', 'totalizer'), {
      teams: increment(1),
    });
  }

  public async delete(id: string) {
    await deleteDoc(doc(db, 'teams', id));

    const res = await getDoc(doc(db, 'public', 'teams'));

    const obj = { ...res.data() } as IPublicData;

    const team = obj.list.find(f => f.id === id);

    await updateDoc(doc(db, 'federations', team!.federationId!), {
      teams: arrayRemove(id),
    });

    await updateDoc(doc(db, 'public', 'teams'), {
      list: arrayRemove({
        ...team,
      }),
    });

    await updateDoc(doc(db, 'public', 'totalizer'), {
      teams: increment(-1),
    });
  }
}
