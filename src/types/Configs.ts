import { IFirebaseDate } from './FirebaseData';

export interface IConfigs {
  transferPeriodBegin: IFirebaseDate;
  transferPeriodEnd: IFirebaseDate;
  nextTransferPeriod: IFirebaseDate;
}
