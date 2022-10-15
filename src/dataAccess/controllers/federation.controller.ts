import {
  collection,
  query,
  getDocs,
  limit,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IFederation } from '../../types/Federation';
import { IPublicData } from '../../types/PublicData';
import { UploadFile } from '../../utils/uploadFile';
import { ITeam } from '../../types/Team';

export interface ICreateFed
  extends Omit<
    IFederation,
    | 'id'
    | 'logo'
    | 'electionMinutes'
    | 'presidentDocument'
    | 'federationDocument'
    | 'updatedAt'
    | 'createdAt'
  > {
  logo: File;
  presidentDocument: File;
  federationDocument: File;
  electionMinutes: File;
}

export class FederationController {
  public async list() {
    const q = query(collection(db, 'federations'), limit(20));
    const querySnapshot = await getDocs(q);

    const result = [] as Array<IFederation>;

    querySnapshot.forEach(d =>
      // @ts-ignore
      result.push({
        id: d.id,
        ...d.data(),
      }),
    );

    return result;
  }

  public async getOne(id: string) {
    const res = await getDoc(doc(db, 'federations', id));

    const data = {
      id: res.id,
      ...res.data(),
    } as IFederation;

    let formattedTeams: Array<ITeam> = [];

    if (data.teams && data.teams.length > 0) {
      const teamsReads = data.teams.map(async t => getDoc(doc(db, 'teams', t)));
      const teamsData = await Promise.all(teamsReads);

      formattedTeams = teamsData.map(
        t =>
          ({
            ...t.data(),
            id: t.id,
          } as ITeam),
      );
    }

    return {
      ...data,
      teamsList: formattedTeams,
    };
  }

  public async create(data: ICreateFed) {
    const {
      name,
      email,
      beginningOfTerm,
      endOfTerm,
      initials,
      presidentName,
      uf,
      logo: logoFile,
      electionMinutes: electionMinutesFile,
      presidentDocument: presidentDocumentFile,
      federationDocument: federationDocumentFile,
    } = data;

    const { id } = await addDoc(collection(db, 'federations'), {
      name,
      email,
      beginningOfTerm,
      endOfTerm,
      initials,
      presidentName,
      uf,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await updateDoc(doc(db, 'public', 'federations'), {
      list: arrayUnion({
        id,
        name,
      }),
    });

    const logo = await UploadFile(
      `federations/${id}/${logoFile.name}`,
      logoFile,
    );
    const electionMinutes = await UploadFile(
      `federations/${id}/${electionMinutesFile.name}`,
      electionMinutesFile,
    );
    const presidentDocument = await UploadFile(
      `federations/${id}/${presidentDocumentFile.name}`,
      presidentDocumentFile,
    );
    const federationDocument = await UploadFile(
      `federations/${id}/${federationDocumentFile.name}`,
      federationDocumentFile,
    );

    await updateDoc(doc(db, 'federations', id), {
      logo,
      electionMinutes,
      presidentDocument,
      federationDocument,
    });
  }

  public async delete(id: string) {
    await deleteDoc(doc(db, 'federations', id));

    const res = await getDoc(doc(db, 'public', 'federations'));

    const obj = { ...res.data() } as IPublicData;

    const federation = obj.list.find(f => f.id === id);

    await updateDoc(doc(db, 'public', 'federations'), {
      list: arrayRemove({
        ...federation,
      }),
    });
  }
}
