import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDisableUser } from '../../../../dataAccess/hooks/user/useDisableUser';
import { useGlobal } from '../../../../contexts/global.context';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';

interface IProps {
  id: string;
  teamId: string;
}

export function ActionButtons({ id, teamId }: IProps) {
  const { mutateAsync } = useDisableUser();
  const { user } = useGlobal();
  const isTeamManager = useHasPermission([Roles.ADMINCLUBE]);

  return (
    <ListActionButtons
      editPermission={isTeamManager && user?.relatedId === teamId}
      deletePermission={isTeamManager && user?.relatedId === teamId}
      editBtn={() => console.log('edit')}
      deleteBtn={async () => {
        // eslint-disable-next-line no-alert
        if (
          window.confirm('Deseja realmente apagar esse membro da comissão?')
        ) {
          await mutateAsync(id);

          toast.success('Apagado com sucesso!');
        }
      }}
    />
  );
}
