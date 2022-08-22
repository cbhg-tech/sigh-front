import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { IconButton } from '../../../../components/Inputs/IconButton';
import { useDisableUser } from '../../../../dataAccess/hooks/user/useDisableUser';

interface IProps {
  id: string;
}

export function ActionButtons({ id }: IProps) {
  const { mutateAsync } = useDisableUser();

  return (
    <div className="flex gap-2 items-center justify-end">
      <IconButton
        icon={MdEdit}
        className="text-light-primary"
        size="1.5rem"
        onClick={() => console.log(id)}
      />
      <IconButton
        icon={MdOutlineDeleteOutline}
        className="text-light-error"
        size="1.5rem"
        onClick={async () => {
          // eslint-disable-next-line no-alert
          if (window.confirm('Deseja realmente desativar este usuário?')) {
            await mutateAsync(id);

            toast.success('Usuário desativado com sucesso!');
          }
        }}
      />
    </div>
  );
}
