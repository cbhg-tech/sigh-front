import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../app/FirebaseConfig';
import { Status } from '../../enums/Status';
import { ITransfer } from '../../types/Transfer';

export type ICreateTransfer = Omit<ITransfer, 'log' | 'status'>;

export class TransferController {
  public async create(data: ICreateTransfer) {
    await addDoc(collection(db, 'transfers'), {
      ...data,
      status: Status.PENDING,
      log: [],
    });
  }
}
