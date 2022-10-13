import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { Status } from '../../enums/Status';
import { ITransfer } from '../../types/Transfer';

export interface ICreateTransfer
  extends Omit<ITransfer, 'log' | 'status' | 'transferData'> {
  transferData: Date;
}

export class TransferController {
  public async create(data: ICreateTransfer) {
    await addDoc(collection(db, 'transfers'), {
      ...data,
      status: Status.PENDING,
      log: [],
    });
  }

  public async getAll() {
    const q = query(collection(db, 'transfers'));

    const querySnapshot = await getDocs(q);

    const transfers: ITransfer[] = [];

    querySnapshot.forEach(doc => {
      const data = { id: doc.id, ...doc.data() } as ITransfer;
      transfers.push(data);
    });

    return transfers;
  }

  public async getPending() {
    const q = query(
      collection(db, 'transfers'),
      where('status', '==', Status.PENDING),
    );

    const querySnapshot = await getDocs(q);

    const transfers: ITransfer[] = [];

    querySnapshot.forEach(doc => {
      const data = { id: doc.id, ...doc.data() } as ITransfer;
      transfers.push(data);
    });

    return transfers;
  }

  public async getOne(id: string) {
    const querySnapshot = await getDoc(doc(db, 'transfers', id));

    const data = { id: querySnapshot.id, ...querySnapshot.data() } as ITransfer;

    return data;
  }

  public async update(data: ITransfer) {
    const { id } = data;

    // eslint-disable-next-line no-param-reassign
    delete data.id;

    if (!id) throw new Error('Transfer ID is required');

    await updateDoc(doc(db, 'transfers', id), { ...data });

    if (data.status === 'Aprovado') {
      await updateDoc(doc(db, 'users', data.user.id), {
        related: data.destinationTeam,
        team: {
          id: data.destinationTeamId,
          name: data.destinationTeam,
        },
      });
    }
  }
}
