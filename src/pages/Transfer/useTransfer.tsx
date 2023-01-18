import { useQuery } from '@tanstack/react-query';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../app/FirebaseConfig';
import { useGlobal } from '../../contexts/global.context';
import { Roles } from '../../enums/Roles';
import { Status } from '../../enums/Status';
import { joinTransfer } from '../../services/joinTransfers';
import { ITransfer } from '../../types/Transfer';

interface IProps {
  fetchAll?: boolean;
  transferId?: string;
}

export const useTransfer = ({ fetchAll, transferId }: IProps) => {
  const { user } = useGlobal();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>(Status.PENDING);

  const getTransfer = async () => {
    const res = await getDocs(collection(db, 'transfers'));

    const arr: ITransfer[] = [];

    res.forEach(doc => {
      arr.push({ ...doc.data(), id: doc.id } as ITransfer);
    });

    const transfersRead = arr.map(t => joinTransfer(t));

    return Promise.all(transfersRead);
  };

  const getOneTransfer = async (id: string) => {
    const res = await getDoc(doc(db, 'transfers', id));

    const transfer = { ...res.data(), id: res.id } as ITransfer;

    return joinTransfer(transfer);
  };

  const getUserActiveTransfer = async () => {
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
  };

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
    getTransfer,
    {
      enabled: fetchAll,
    },
  );

  const { data: oneTransfer, status: queryOneStatus } = useQuery(
    ['getOneTransfer', transferId],
    () => getOneTransfer(transferId!),
    {
      enabled: !!transferId,
    },
  );

  const { data: userTransfer, status: queryUserTransferStatus } = useQuery(
    ['getUserActiveTransfer'],
    getUserActiveTransfer,
    {
      enabled: !fetchAll && !transferId && !!user,
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
  };
};
