import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ListActionButtons } from '../../../../components/ListActionButtons';
import { useDeleteTeam } from '../../../../dataAccess/hooks/team/useDeleteTeam';
import { useHasPermission } from '../../../../hooks/useHasPermission';
import { Roles } from '../../../../enums/Roles';
import { useGlobal } from '../../../../contexts/global.context';
import { useDeletePartnerProject } from '../../../../dataAccess/hooks/partnerProject/useDeletePartnerProject';

interface IProps {
  id: string;
  relatedId: string;
}

export function ActionsButtons({ id, relatedId }: IProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useDeletePartnerProject();
  const { user } = useGlobal();

  const isAdmin = useHasPermission([
    Roles.ADMIN,
    Roles.ADMINFEDERACAO,
    Roles.ADMINCLUBE,
  ]);

  return (
    <ListActionButtons
      viewPermission
      deletePermission={isAdmin && user?.relatedId === relatedId}
      editPermission={isAdmin && user?.relatedId === relatedId}
      viewBtn={() => navigate(`/app/projetosparceiros/detalhes/${id}`)}
      editBtn={() => navigate(`/app/projetosparceiros/editar/${id}`)}
      deleteBtn={async () => {
        if (
          window.confirm('Deseja realmente apagar esse Projeto de Parceiro?')
        ) {
          await mutateAsync(id);

          toast.success('Projeto Apagado apagada com sucesso!');
        }
      }}
    />
  );
}
