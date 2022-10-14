import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';

interface IProps {
  id: string;
}

export function ActionsButtons({ id }: IProps) {
  const isAthlete = useHasPermission([Roles.USER]);

  return (
    <ListActionButtons
      deletePermission={false}
      viewPermission
      editPermission={isAthlete}
      editBtn={() => console.log('edit')}
      viewBtn={() => console.log('view')}
    />
  );
}
