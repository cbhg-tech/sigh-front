import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { useCallback } from 'react';
import { db } from '../app/FirebaseConfig';
import { useGlobal } from '../contexts/global.context';
import { Roles } from '../enums/Roles';
import { Status } from '../enums/Status';
import { IUser } from '../types/User';
import { IUserApproval } from '../types/UserApproval';
import { checkIfAthleteIsActiveOrPending } from '../utils/checkIfAthleteIsActiveOrPending';
import { useHasPermission } from './useHasPermission';

export const useApprovalAlert = (data?: IUser) => {
  const { user } = useGlobal();
  const isAdmin = useHasPermission([
    Roles.ADMIN,
    Roles.ADMINCLUBE,
    Roles.ADMINFEDERACAO,
  ]);

  const getApprovalData = useCallback(async () => {
    if (!data?.id) return null;

    const approval = await getDoc(doc(db, 'userApproval', data.id));

    if (approval.exists()) {
      const d = approval.data() as IUserApproval;

      const userIsPending = checkIfAthleteIsActiveOrPending(data) === 'Pending';
      let message = '';
      let alertType: 'warning' | 'error' = 'warning';
      const canShowAlert =
        (isAdmin && d.status !== Status.ACTIVE) ||
        (isAdmin && userIsPending) ||
        (user?.status !== Status.ACTIVE && user?.id === data.id);

      if (userIsPending) message = 'Usuário ainda não aceitou os termos de uso';

      if (!d.teamApproved) message = 'Aguardando aprovação do Clube';

      if (d.teamApproved && !d.federationApproved)
        message = 'Aguardando aprovação da Federação';

      if (d.federationApproved && !d.cbhgApproved)
        message = 'Aguardando aprovação do CBHG';

      if (d.status === Status.REJECTED) {
        message = 'Usuário rejeitado, necessária reavaliação da ficha!';
        alertType = 'error';
      }

      return {
        message,
        canShowAlert,
        alertType,
      };
    }

    return null;
  }, [data, isAdmin, user]);

  const { isLoading: isLoadingApproval, data: approvalAlertData } = useQuery(
    ['getApprovalDataDetail', data?.id],
    getApprovalData,
    {
      enabled: !!data?.id && !!user,
      refetchOnWindowFocus: false,
    },
  );

  return {
    isLoadingApproval,
    approvalAlertData,
  };
};
