import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDisableUser } from '../../../../dataAccess/hooks/user/useDisableUser';
import { useGlobal } from '../../../../contexts/global.context';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';
import { useDeleteTechnicalComittee } from '../../../../dataAccess/hooks/technicalComittee/useDeleteTechnicalComittee';

interface IProps {
  id: string;
  teamId: string;
}

export function ActionButtons({ id, teamId }: IProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useDeleteTechnicalComittee();
  const { user } = useGlobal();
  const isTeamManager = useHasPermission([Roles.ADMINCLUBE]);

  return (
    <ListActionButtons
      viewPermission
      editPermission={isTeamManager && user?.relatedId === teamId}
      deletePermission={isTeamManager && user?.relatedId === teamId}
      viewBtn={() => navigate(`/app/tecnico/detalhes/${id}`)}
      editBtn={() => navigate(`/app/tecnico/editar/${id}`)}
      deleteBtn={async () => {
        if (
          // eslint-disable-next-line no-alert
          window.confirm('Deseja realmente apagar esse membro da comissão?')
        ) {
          await mutateAsync(id);

          toast.success('Apagado com sucesso!');
        }
      }}
    />
  );
}
