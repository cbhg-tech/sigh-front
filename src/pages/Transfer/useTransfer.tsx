// prettier-disable
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../app/FirebaseConfig';
import { useGlobal } from '../../contexts/global.context';
import { Roles } from '../../enums/Roles';
import { Status } from '../../enums/Status';
import { joinTransfer } from '../../services/joinTransfers';
import { ITransfer } from '../../types/Transfer';
import { UploadFile } from '../../utils/uploadFile';

interface IProps {
  fetchAll?: boolean;
  transferId?: string;
}

export interface ISubmitTransfer
  extends Omit<
    ITransfer,
    'log' | 'status' | 'createdAt' | 'updatedAt' | 'documents'
  > {
  id?: string;
  documentsFile: {
    federationPaymentVoucher?: File | string;
    cbhgPaymentVoucher?: File | string;
  };
}

export const useTransfer = ({ fetchAll, transferId }: IProps) => {
  const queryClient = useQueryClient();
  const { user } = useGlobal();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>(Status.PENDING);

  const canApproveWorkflow = (td?: ITransfer, isDisplayOnly?: boolean) => {
    if (isDisplayOnly) return false;

    if (!td) return false;

    if (
      user?.role === Roles.ADMINFEDERACAO &&
      td?.status !== Status.ACTIVE &&
      td?.currentFederationId === td?.destinationFederationId &&
      td?.destinationFederationStatus === Status.ACTIVE &&
      td?.currentFederationStatus === Status.ACTIVE
    ) {
      return false;
    }

    if (td?.status !== Status.ACTIVE) {
      if (
        user?.role === Roles.ADMINCLUBE &&
        td?.currentTeamId === user?.relatedId
      )
        return true;

      if (
        user?.role === Roles.ADMINCLUBE &&
        td?.destinationTeamId === user?.relatedId &&
        td?.currentTeamStatus === Status.ACTIVE
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        td?.currentFederationId === user?.relatedId &&
        td?.destinationTeamStatus === Status.ACTIVE
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        td?.destinationFederationId === user?.relatedId &&
        td?.currentFederationStatus === Status.ACTIVE
      )
        return true;

      if (
        user?.role === Roles.ADMIN &&
        td?.destinationFederationStatus === Status.ACTIVE
      )
        return true;
    }

    return false;
  };

  const { data, status: queryStatus } = useQuery(
    ['getTransfers'],
    async () => {
      const res = await getDocs(collection(db, 'transfers'));

      const arr: ITransfer[] = [];

      res.forEach(doc => {
        arr.push({ ...doc.data(), id: doc.id } as ITransfer);
      });

      const transfersRead = arr.map(t => joinTransfer(t));

      return Promise.all(transfersRead);
    },
    {
      enabled: fetchAll,
    },
  );

  const { data: oneTransfer, status: queryOneStatus } = useQuery(
    ['getOneTransfer', transferId],
    async () => {
      const res = await getDoc(doc(db, 'transfers', transferId!));

      const transfer = { ...res.data(), id: res.id } as ITransfer;

      return joinTransfer(transfer);
    },
    {
      enabled: !!transferId,
    },
  );

  const { data: userTransfer, status: queryUserTransferStatus } = useQuery(
    ['getUserActiveTransfer'],
    async () => {
      const q = query(
        collection(db, 'transfers'),
        where('userId', '==', user?.id),
        where('status', '!=', Status.ACTIVE),
      );

      const res = await getDocs(q);

      const arr: ITransfer[] = [];

      res.forEach(doc => {
        arr.push({ ...doc.data(), id: doc.id } as ITransfer);
      });

      const transfersRead = arr.map(t => joinTransfer(t));

      const transfers = await Promise.all(transfersRead);

      return transfers[0];
    },
    {
      enabled: !fetchAll && !transferId && !!user,
    },
  );

  const { mutateAsync: onSubmit, status: submitQueryStatus } = useMutation(
    async (data: ISubmitTransfer) => {
      try {
        const filesUrl = {
          federationPaymentVoucher: '',
          cbhgPaymentVoucher: '',
        };

        if (data.documentsFile.federationPaymentVoucher) {
          filesUrl.federationPaymentVoucher =
            typeof data.documentsFile.federationPaymentVoucher !== 'string'
              ? await UploadFile(
                `/athletes/${data.userId}/transfers/${data.id}/federationPaymentVoucher`,
                data.documentsFile.federationPaymentVoucher,
              )
              : data.documentsFile.federationPaymentVoucher;
        }

        if (data.documentsFile.cbhgPaymentVoucher) {
          filesUrl.cbhgPaymentVoucher =
            typeof data.documentsFile.cbhgPaymentVoucher !== 'string'
              ? await UploadFile(
                `/athletes/${data.userId}/transfers/${data.id}/cbhgPaymentVoucher`,
                data.documentsFile.cbhgPaymentVoucher,
              )
              : data.documentsFile.cbhgPaymentVoucher;
        }

        if (!data.id) {
          await addDoc(collection(db, 'transfers'), {
            ...data,
            documents: filesUrl,
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
        } else {
          await updateDoc(doc(db, 'transfers', data.id), {
            obs: data.obs,
            documents: filesUrl,
            updatedAt: new Date(),
          });
        }

        await queryClient.invalidateQueries(['getTransfers']);
        await queryClient.invalidateQueries(['getUserActiveTransfer']);
      } catch (error) {
        console.log(error);
      }
    },
  );

  let transfers = data || [];

  if (filter) {
    transfers = transfers.filter(transfer =>
      transfer.user?.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  if (statusFilter)
    transfers = transfers.filter(ap => ap.status === statusFilter);

  return {
    transfers,
    queryStatus,
    setFilter,
    setStatusFilter,
    statusFilter,
    canApproveWorkflow,
    oneTransfer,
    queryOneStatus,
    userTransfer,
    queryUserTransferStatus,
    onSubmit,
    submitQueryStatus,
  };
};
