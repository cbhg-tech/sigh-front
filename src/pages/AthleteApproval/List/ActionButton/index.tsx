import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '../../../../components/Inputs/IconButton';

interface IProps {
  id: string;
}

export function ActionButton({ id }: IProps) {
  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        icon={MdSearch}
        onClick={() => navigate(`/app/restrito/atletas/aprovacao/${id}`)}
      />
    </div>
  );
}
