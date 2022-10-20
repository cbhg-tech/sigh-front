import {
  doc,
  addDoc,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  limit,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { ITechnicialCommittee } from '../../types/TechnicialCommittee';
import { UploadFile } from '../../utils/uploadFile';
import { Roles } from '../../enums/Roles';
import { ITeam } from '../../types/Team';

export interface ICreateTechnicalComittee
  extends Omit<
    ITechnicialCommittee,
    'createdAt' | 'updatedAt' | 'documentFile' | 'id' | 'related'
  > {
  documentFile: File;
}

export interface IUpdateTechnicalComittee
  extends Omit<
    ITechnicialCommittee,
    'createdAt' | 'updatedAt' | 'documentFile' | 'related'
  > {
  documentFile: File | string;
}

export class TechnicalComitteeController {
  public async create(data: ICreateTechnicalComittee) {
    const { documentFile, relatedId } = data;

    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    delete data.documentFile;

    const res = await addDoc(collection(db, 'technicalComittee'), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const documentUrl = await UploadFile(
      `technicalComittee/${relatedId}`,
      documentFile,
    );

    await updateDoc(doc(db, 'technicalComittee', res.id), {
      documentFile: documentUrl,
    });
  }

  public async list() {
    const q = query(collection(db, 'technicalComittee'), limit(20));

    const res = await getDocs(q);

    const data = [] as Array<ITechnicialCommittee>;

    res.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
      } as ITechnicialCommittee);
    });

    const joinReads = data.map(d => getDoc(doc(db, 'teams', d.relatedId!)));

    return Promise.all(joinReads).then(joinResults => {
      return data.map(d => {
        const related = joinResults.find(rr => rr.id === d.relatedId);

        return {
          ...d,
          related: related?.data() as ITeam,
        };
      });
    });
  }

  public async getOne(id: string) {
    const res = await getDoc(doc(db, 'technicalComittee', id));

    return {
      id: res.id,
      ...res.data(),
    } as ITechnicialCommittee;
  }

  public async update(data: IUpdateTechnicalComittee) {
    const { id } = data;

    await updateDoc(doc(db, 'technicalComittee', id!), {
      ...data,
      updatedAt: new Date(),
    });
  }

  public async delete(id: string) {
    await deleteDoc(doc(db, 'technicalComittee', id));
  }
}
