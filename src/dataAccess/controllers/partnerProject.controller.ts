import {
  doc,
  addDoc,
  collection,
  getDocs,
  query,
  limit,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { ITeam } from '../../types/Team';
import {
  IPartnerProject,
  IPartnerProjectCofederationRelated,
} from '../../types/ProjectPartner';
import { IFederation } from '../../types/Federation';
import { UploadFile } from '../../utils/uploadFile';

export type ICreatePartnerProject = Omit<
  IPartnerProject,
  'createdAt' | 'updatedAt' | 'id' | 'related'
>;

export type IUpdatePartnerProject = Omit<
  IPartnerProject,
  'createdAt' | 'updatedAt' | 'related'
>;

export class PartnerProjectController {
  public async create(data: ICreatePartnerProject) {
    await addDoc(collection(db, 'partnerProject'), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private async joinProjects(project: IPartnerProject) {
    const { relatedType } = project;

    console.log(relatedType);

    if (relatedType === 'Cofederation') {
      return {
        ...project,
        related: {
          name: 'CBHG - Administração',
        } as IPartnerProjectCofederationRelated,
      };
    }

    if (relatedType === 'Federation') {
      const res = await getDoc(doc(db, 'federations', project.relatedId!));

      return {
        ...project,
        related: res.data() as IFederation,
      };
    }

    if (relatedType === 'Team') {
      const res = await getDoc(doc(db, 'teams', project.relatedId!));

      return {
        ...project,
        related: res.data() as ITeam,
      };
    }
  }

  public async list() {
    const q = query(collection(db, 'partnerProject'), limit(20));

    const res = await getDocs(q);

    const data = [] as Array<IPartnerProject>;

    res.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
      } as IPartnerProject);
    });

    const joinReads = data.map(d => this.joinProjects(d));

    return Promise.all(joinReads);
  }

  public async getOne(id: string) {
    const res = await getDoc(doc(db, 'partnerProject', id));

    const data = {
      ...(res.data() as IPartnerProject),
      id: res.id,
    };

    return this.joinProjects(data);
  }

  public async update(data: IUpdatePartnerProject) {
    const { id } = data;

    await updateDoc(doc(db, 'partnerProject', id!), {
      ...data,
      updatedAt: new Date(),
    });
  }

  public async delete(id: string) {
    await deleteDoc(doc(db, 'partnerProject', id));
  }
}
