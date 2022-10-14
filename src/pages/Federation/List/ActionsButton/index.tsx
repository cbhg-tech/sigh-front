import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteFederation } from '../../../../dataAccess/hooks/federation/useDeleteFederation';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const { mutateAsync } = useDeleteFederation();
  const isAdmin = useHasPermission([Roles.ADMIN]);

  return (
    <ListActionButtons
      editPermission={isAdmin}
      deletePermission={isAdmin}
      editBtn={() => console.log('edit')}
      deleteBtn={async () => {
        if (window.confirm('Deseja realmente apagar essa FEDERAÇÃO?')) {
          await mutateAsync(id);

          toast.success('Federação apagada com sucesso!');
        }
      }}
    />
  );
}
