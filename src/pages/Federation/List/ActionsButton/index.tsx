import { toast } from 'react-toastify';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteFederation } from '../../../../dataAccess/hooks/federation/useDeleteFederation';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const { mutateAsync } = useDeleteFederation();

  return (
    <ListActionButtons
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
