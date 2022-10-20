import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteFederation } from '../../../../dataAccess/hooks/federation/useDeleteFederation';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';
import { useGetOneFederation } from '../../../../dataAccess/hooks/federation/useGetOneFederation';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useDeleteFederation();
  const { data } = useGetOneFederation(id);
  const isAdmin = useHasPermission([Roles.ADMIN]);

  return (
    <ListActionButtons
      viewPermission
      editPermission={isAdmin}
      deletePermission={isAdmin}
      viewBtn={() => navigate(`/app/federacoes/detalhes/${id}`)}
      editBtn={() => navigate(`/app/federacoes/editar/${id}`)}
      deleteBtn={async () => {
        if (window.confirm('Deseja realmente apagar essa FEDERAÇÃO?')) {
          if (data?.teams && data?.teams?.length > 0) {
            return toast.error(
              'Não é possível apagar uma federação que possui clubes vinculados',
            );
          }

          await mutateAsync(id);

          toast.success('Federação apagada com sucesso!');
        }
      }}
    />
  );
}
