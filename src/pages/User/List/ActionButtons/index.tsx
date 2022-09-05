import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDisableUser } from '../../../../dataAccess/hooks/user/useDisableUser';

interface IProps {
  id: string;
}

export function ActionButtons({ id }: IProps) {
  const { mutateAsync } = useDisableUser();

  return (
    <ListActionButtons
      editBtn={() => console.log('edit')}
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
