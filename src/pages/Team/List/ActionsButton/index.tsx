import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteTeam } from '../../../../dataAccess/hooks/team/useDeleteTeam';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useDeleteTeam();
  const isAdmin = useHasPermission([Roles.ADMIN]);

  return (
    <ListActionButtons
      viewPermission
      deletePermission={isAdmin}
      editPermission={isAdmin}
      viewBtn={() => navigate(`/app/clubes/detalhes/${id}`)}
      editBtn={() => console.log('edit')}
      deleteBtn={async () => {
        if (window.confirm('Deseja realmente apagar esse CLUBE?')) {
          await mutateAsync(id);

          toast.success('Federação apagada com sucesso!');
        }
      }}
    />
  );
}
