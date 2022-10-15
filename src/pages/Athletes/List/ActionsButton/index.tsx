import { useNavigate } from 'react-router-dom';
import { ListActionButtons } from '../../../../components/ListActionButtons';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const navigate = useNavigate();

  return (
    <ListActionButtons
      viewPermission
      deletePermission={false}
      editPermission={false}
      viewBtn={() => navigate(`/app/atletas/detalhes/${id}`)}
    />
  );
}
