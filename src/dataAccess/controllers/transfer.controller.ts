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
  increment,
} from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { Status } from '../../enums/Status';
import { ITransfer } from '../../types/Transfer';
import { joinTransfer } from '../../services/joinTransfers';
import { UploadFile } from '../../utils/uploadFile';

export interface ICreateTransfer
  extends Omit<
    ITransfer,
    'log' | 'status' | 'createdAt' | 'updatedAt' | 'documents'
  > {
  documents: {
    federationPaymentVoucher: File | null;
    cbhgPaymentVoucher: File;
  };
}

export class TransferController {
  public async create(data: ICreateTransfer) {
    const filesUrl = {
      federationPaymentVoucher: '',
      cbhgPaymentVoucher: '',
    };

    if (data.documents.federationPaymentVoucher) {
      filesUrl.federationPaymentVoucher = await UploadFile(
        `/athletes/${data.userId}/transfers/${data.id}/federationPaymentVoucher`,
        data.documents.federationPaymentVoucher,
      );
    }

    filesUrl.cbhgPaymentVoucher = await UploadFile(
      `/athletes/${data.userId}/transfers/${data.id}/cbhgPaymentVoucher`,
      data.documents.cbhgPaymentVoucher,
    );

    await addDoc(collection(db, 'transfers'), {
      ...data,
      documents: {
        ...filesUrl,
      },
      status: Status.PENDING,
      log: [],
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    await updateDoc(doc(db, 'public', 'totalizer'), {
      transfers: increment(1),
    });

    await updateDoc(doc(db, 'users', data.userId), {
      transfering: true,
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
