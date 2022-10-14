/* eslint-disable no-param-reassign */
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
import { joinTransfer } from '../../services/joinTransfers';

export type ICreateTransfer = Omit<
  ITransfer,
  'log' | 'status' | 'createdAt' | 'updatedAt'
>;

export class TransferController {
  public async create(data: ICreateTransfer) {
    await addDoc(collection(db, 'transfers'), {
      ...data,
      status: Status.PENDING,
      log: [],
      updatedAt: new Date(),
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

    const transfersRead = transfers.map(t => joinTransfer(t));

    return Promise.all(transfersRead);
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

    const transfersRead = transfers.map(t => joinTransfer(t));

    return Promise.all(transfersRead);
  }

  public async getOne(id: string) {
    const querySnapshot = await getDoc(doc(db, 'transfers', id));

    const data = { id: querySnapshot.id, ...querySnapshot.data() } as ITransfer;

    return joinTransfer(data);
  }

  public async update(data: ITransfer) {
    const { id } = data;

    const { destinationTeam } = data;

    delete data.id;
    delete data.user;
    delete data.currentTeam;
    delete data.destinationTeam;
    delete data.currentFederation;
    delete data.destinationFederation;

    if (!id) throw new Error('Transfer ID is required');

    await updateDoc(doc(db, 'transfers', id), {
      ...data,
      updatedAt: new Date(),
    });

    // TODO: buscar dados do time para atualizar o usuário
    if (data.status === 'Aprovado') {
      await updateDoc(doc(db, 'users', data.userId), {
        relatedName: destinationTeam?.name,
        relatedId: data.destinationTeamId,
        relatedType: 'team',
      });
    }
  }
}
