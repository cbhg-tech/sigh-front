import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton } from '../Inputs/IconButton';

interface IProps {
  deleteBtn: () => void;
  editBtn: () => void;
}

export function ListActionButtons({ deleteBtn, editBtn }: IProps) {
  return (
    <div className="flex gap-2 items-center justify-end">
      <IconButton
        icon={MdEdit}
        className="text-light-primary"
        size="1.5rem"
        onClick={editBtn}
      />
      <IconButton
        icon={MdOutlineDeleteOutline}
        className="text-light-error"
        size="1.5rem"
        onClick={deleteBtn}
      />
    </div>
  );
}
