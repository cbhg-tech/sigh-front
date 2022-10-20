import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDisableUser } from '../../../../dataAccess/hooks/user/useDisableUser';

interface IProps {
  id: string;
}

export function ActionButtons({ id }: IProps) {
  const navigate = useNavigate();

  const { mutateAsync } = useDisableUser();

  return (
    <ListActionButtons
      viewBtn={() => navigate(`/app/usuarios/detalhes/${id}`)}
      editBtn={() => navigate(`/app/usuarios/editar/${id}`)}
      deleteBtn={async () => {
        // eslint-disable-next-line no-alert
        if (window.confirm('Deseja realmente desativar este usuário?')) {
          await mutateAsync(id);

          toast.success('Usuário desativado com sucesso!');
        }
      }}
    />
  );
}
