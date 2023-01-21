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
import { Status } from '../../enums/Status';
import { ITeam } from '../../types/Team';
import { IUserApproval } from '../../types/UserApproval';

export const useAthleteApprovalList = () => {
  const { user } = useGlobal();
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>(Status.PENDING);

  const getApprovalList = async (team?: string) => {
    if (!user) return;

    let q = query(collection(db, 'userApproval'));

    if (user?.relatedType === 'team') {
      q = query(
        collection(db, 'userApproval'),
        where('teamId', '==', user?.relatedId),
      );
    }

    const usersTransfers = await getDocs(q);

    const userApproval = [] as Array<IUserApproval>;

    usersTransfers.forEach(doc => {
      // @ts-ignore
      userApproval.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    const relatedReads = userApproval.map(async ua =>
      getDoc(doc(db, 'teams', ua.teamId)),
    );
    const relatedResults = await Promise.all(relatedReads);

    return userApproval.map(ua => {
      const related = relatedResults.find(rr => rr.id === ua.teamId);

      return {
        ...ua,
        team: related?.data() as ITeam,
      };
    });
  };

  const { data, status } = useQuery(
    ['getApprovalList'],
    () => getApprovalList(),
    {
      enabled: !!user,
      refetchOnWindowFocus: false,
    },
  );

  console.log(data);

  let tableData = data || [];

  if (statusFilter !== Status.ACTIVE) {
    if (user?.relatedType === 'team') {
      tableData = tableData.filter(ap => !ap.teamApproved);
    } else if (
      user?.relatedType === 'federation' &&
      user?.relatedName !== 'CBHG - Administração'
    ) {
      tableData = tableData
        .filter(ap => ap.team?.federationId === user?.relatedId)
        .filter(ap => ap.teamApproved && !ap.federationApproved);
    } else if (user?.relatedName === 'CBHG - Administração') {
      tableData = tableData.filter(
        ap => ap.federationApproved && !ap.cbhgApproved,
      );
    }
  }

  if (filter) {
    tableData = tableData.filter(athlete =>
      athlete.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  if (statusFilter)
    tableData = tableData.filter(ap => ap.status === statusFilter);

  return {
    tableData,
    status,
    setFilter,
    statusFilter,
    setStatusFilter,
  };
};
