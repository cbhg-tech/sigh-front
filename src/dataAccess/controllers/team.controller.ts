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
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { ITeam } from '../../types/Team';
import { UploadFile } from '../../utils/uploadFile';

export interface ICreateTeam
  extends Omit<
    ITeam,
    | 'id'
    | 'logo'
    | 'electionMinutes'
    | 'presidentDocument'
    | 'federationDocument'
  > {
  logo: File;
  presidentDocument: File;
  federationDocument: File;
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

    return result;
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
      federation,
      url,
      logo: logoFile,
      electionMinutes: electionMinutesFile,
      presidentDocument: presidentDocumentFile,
      federationDocument: federationDocumentFile,
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
      federation,
      url,
    });

    await updateDoc(doc(db, 'federations', federation.id), {
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
      `teams/${id}/${federationDocumentFile.name}`,
      federationDocumentFile,
    );

    await updateDoc(doc(db, 'teams', id), {
      logo,
      electionMinutes,
      presidentDocument,
      federationDocument,
    });
  }

  public async delete(id: string) {
    await deleteDoc(doc(db, 'teams', id));
  }
}
