import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteTeam } from '../../../../dataAccess/hooks/team/useDeleteTeam';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';
import { useGlobal } from '../../../../contexts/global.context';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const navigate = useNavigate();
  const { user } = useGlobal();
  const { mutateAsync } = useDeleteTeam();
  const isAdmin = useHasPermission([Roles.ADMIN]);
  let canSelfEdit = useHasPermission([Roles.ADMINCLUBE]);

  canSelfEdit = canSelfEdit && user?.relatedId === id;

  const canEdit = user?.role === Roles.ADMIN ? isAdmin : canSelfEdit;

  return (
    <ListActionButtons
      viewPermission
      deletePermission={isAdmin}
      editPermission={canEdit}
      viewBtn={() => navigate(`/app/clubes/detalhes/${id}`)}
      editBtn={() => navigate(`/app/clubes/editar/${id}`)}
      deleteBtn={async () => {
        if (window.confirm('Deseja realmente apagar esse CLUBE?')) {
          await mutateAsync(id);

          toast.success('Federação apagada com sucesso!');
        }
      }}
    />
  );
}
