import {
  collection,
  query,
  getDocs,
  limit,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { IFederation } from '../../types/Federation';
import { UploadFile } from '../../utils/uploadFile';

export interface ICreateFed
  extends Omit<
    IFederation,
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

  // delete federation based on id
  public async delete(id: string) {
    await deleteDoc(doc(db, 'federations', id));
  }
}
