import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteTeam } from '../../../../dataAccess/hooks/team/useDeleteTeam';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const { mutateAsync } = useDeleteTeam();

  return (
    <ListActionButtons
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
