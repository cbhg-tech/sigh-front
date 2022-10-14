import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteTeam } from '../../../../dataAccess/hooks/team/useDeleteTeam';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const { mutateAsync } = useDeleteTeam();
  const isAdmin = useHasPermission([Roles.ADMIN]);

  return (
    <ListActionButtons
      deletePermission={isAdmin}
      editPermission={isAdmin}
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
