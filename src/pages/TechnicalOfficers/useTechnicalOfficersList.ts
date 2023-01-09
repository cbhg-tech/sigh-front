import { useMutation, useQuery } from '@tanstack/react-query';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../../app/FirebaseConfig';
import { useGetPublicTeams } from '../../dataAccess/hooks/public/useGetPublicTeams';
import { Roles } from '../../enums/Roles';
import { useHasPermission } from '../../hooks/useHasPermission';
import { ITeam } from '../../types/Team';
import { ITechnicalOfficer } from '../../types/TechnicalOfficer';

export const useTechnicalOfficersList = () => {
  const isAdmin = useHasPermission([Roles.ADMIN]);
  const { data: publicTeams } = useGetPublicTeams();

  const [filter, setFilter] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'technicalOfficers', id));
  };

  const getTechnicalOfficersList = async () => {
    const q = query(collection(db, 'technicalOfficers'));

    const res = await getDocs(q);

    const data = [] as Array<ITechnicalOfficer>;

    res.forEach(doc => {
      data.push({
        id: doc.id,
        ...doc.data(),
      } as ITechnicalOfficer);
    });

    const joinReads = data.map(d => getDoc(doc(db, 'teams', d.relatedId!)));

    return Promise.all(joinReads).then(joinResults => {
      return data.map(d => {
        const related = joinResults.find(rr => rr.id === d.relatedId);

        return {
          ...d,
          related: related?.data() as ITeam,
        };
      });
    });
  };

  const { data, status: getStatus } = useQuery(
    ['technicalOfficersList'],
    getTechnicalOfficersList,
    {
      enabled: isAdmin,
      refetchOnWindowFocus: false,
    },
  );
  const { status: deleteStatus, mutateAsync: deleteTechnicalOfficer } =
    useMutation(handleDelete);

  let tableData = data || [];

  if (filterTeam)
    tableData = tableData.filter(tech => tech.relatedId === filterTeam);

  if (filter) {
    tableData = tableData.filter(tech =>
      tech.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return {
    isAdmin,
    setFilter,
    setFilterTeam,
    tableData,
    publicTeams,
    getStatus,
    deleteStatus,
    deleteTechnicalOfficer,
  };
};
