import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { MdInfo } from 'react-icons/md';
import { db } from '../../app/FirebaseConfig';
import { useGlobal } from '../../contexts/global.context';
import { Roles } from '../../enums/Roles';
import { useHasPermission } from '../../hooks/useHasPermission';
import { IUserApproval } from '../../types/UserApproval';

type IProps = {
  id?: string;
};

export function WaitingApprovalMessage({ id }: IProps) {
  const { user } = useGlobal();
  const isAdmin = useHasPermission([
    Roles.ADMIN,
    Roles.ADMINCLUBE,
    Roles.ADMINFEDERACAO,
  ]);

  const getApprovalData = async () => {
    const approval = await getDoc(doc(db, 'userApproval', id!));

    if (approval.exists()) {
      const d = approval.data() as IUserApproval;

      if (!d.teamApproved) return 'Aguardando aprovação do Clube';

      if (!d.federationApproved) return 'Aguardando aprovação da Federação';

      if (!d.cbhgApproved) return 'Aguardando aprovação do CBHG';
    }

    return '';
  };

  const { isLoading: isLoadingApproval, data: waitingApproval } = useQuery(
    ['getApprovalDataDetail', id],
    getApprovalData,
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );

  if (!id || (user?.id !== id && !isAdmin)) return null;

  return (
    <div className="rounded-2xl w-full bg-light-warning-container p-4 mb-4 flex gap-4 items-start">
      <MdInfo className="text-2xl text-light-on-warning-container" />
      <div>
        <h2 className="text-lg font-medium text-light-on-warning-container">
          Detalhes
        </h2>
        <p className="text-base text-light-on-warning-container">
          {isLoadingApproval ? 'Carregando...' : waitingApproval}
        </p>
      </div>
    </div>
  );
}
