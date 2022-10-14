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
import dayjs from 'dayjs';
import { db } from '../../app/FirebaseConfig';
import { Status } from '../../enums/Status';
import { ITransfer } from '../../types/Transfer';

export type ICreateTransfer = Omit<
  ITransfer,
  'log' | 'status' | 'transferData' | 'createdAt' | 'updatedAt'
>;

export class TransferController {
  public async create(data: ICreateTransfer) {
    await addDoc(collection(db, 'transfers'), {
      ...data,
      status: Status.PENDING,
      log: [],
      transferData: dayjs().format('DD/MM/YYYY'),
      updateAt: new Date(),
      createdAt: new Date(),
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

    return { id: querySnapshot.id, ...querySnapshot.data() } as ITransfer;
  }

  public async update(data: ITransfer) {
    const { id } = data;

    // eslint-disable-next-line no-param-reassign
    delete data.id;

    if (!id) throw new Error('Transfer ID is required');

    await updateDoc(doc(db, 'transfers', id), {
      ...data,
      updatedAt: new Date(),
    });

    // TODO: buscar dados do time para atualizar o usuário
    if (data.status === 'Aprovado') {
      await updateDoc(doc(db, 'users', data.userId), {
        related: data.destinationTeam,
        team: {
          id: data.destinationTeam,
          name: data.destinationTeam,
        },
      });
    }
  }
}
