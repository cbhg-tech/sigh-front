import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { IconButton } from '../Inputs/IconButton';
import { AiOutlineEye } from 'react-icons/ai';

interface IProps {
  editPermission?: boolean;
  deletePermission?: boolean;
  viewPermission?: boolean;
  deleteBtn?: () => void;
  editBtn?: () => void;
  viewBtn?: () => void;
}

export function ListActionButtons({
  deleteBtn,
  editBtn,
  viewBtn,
  viewPermission = true,
  editPermission = true,
  deletePermission = true,
}: IProps) {
  return (
    <div className="flex gap-2 items-center justify-end">
      {viewPermission && (
        <IconButton
          icon={AiOutlineEye}
          className="text-light-tertiary"
          size="1.5rem"
          onClick={viewBtn}
        />
      )}

      {editPermission && (
        <IconButton
          icon={MdEdit}
          className="text-light-primary"
          size="1.5rem"
          onClick={editBtn}
        />
      )}

      {deletePermission && (
        <IconButton
          icon={MdOutlineDeleteOutline}
          className="text-light-error"
          size="1.5rem"
          onClick={deleteBtn}
        />
      )}
    </div>
  );
}
