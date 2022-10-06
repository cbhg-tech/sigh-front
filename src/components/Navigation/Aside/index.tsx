import { FaUserAlt, FaUserFriends, FaUsers, FaUsersCog } from 'react-icons/fa';
import {
  MdChecklist,
  MdCompareArrows,
  MdDashboard,
  MdInsertDriveFile,
  MdOutlineClose,
  MdOutlineListAlt,
  MdShield,
} from 'react-icons/md';
import { SiGoogleassistant } from 'react-icons/si';
import { useGlobal } from '../../../contexts/global.context';
import { Roles } from '../../../enums/Roles';
import { Divider } from '../../Divider';
import { IconButton } from '../../Inputs/IconButton';
import { ListItem } from './ListItem';
import { ListSubtitle } from './ListSubtitle';

interface IProps {
  isOpen: boolean;
  toogleSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Aside({ isOpen, toogleSideMenu }: IProps) {
  const isOpenStyle = isOpen ? 'translate-x-0' : '-translate-x-full';

  const { user } = useGlobal();

  const isAdmin =
    user?.role === Roles.ADMIN ||
    user?.role === Roles.ADMINCLUBE ||
    user?.role === Roles.ADMINFEDERACAO;

  return (
    <aside
      className={`absolute duration-200 ease-in-out ${isOpenStyle} lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full h-full lg:relative lg:w-full lg:col-span-1 bg-transparent`}
    >
      <div className="bg-light-surface-1 flex flex-col h-full p-4 lg:rounded-3xl">
        <div className="flex justify-end mb-4 lg:hidden">
          <IconButton
            onClick={() => toogleSideMenu(false)}
            icon={MdOutlineClose}
          />
        </div>

        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/dashboard"
          label="Dashboard"
          icon={MdDashboard}
        />
        <Divider />
        <ListSubtitle label={isAdmin ? 'Cadastros' : 'Menu'} />
        {user?.role === Roles.USER && (
          <>
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/perfil"
              label="Meu perfil"
              icon={FaUserAlt}
            />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/transferencia/solicitacao"
              label="Transferências"
              icon={MdCompareArrows}
            />
          </>
        )}
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/atletas/listagem"
          label="Atletas"
          icon={FaUsers}
        />
        {user?.role === Roles.ADMINCLUBE && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/tecnico/listagem"
            label="Comissão técnica"
            icon={FaUserFriends}
          />
        )}
        {isAdmin && (
          <ListItem
            closeModal={() => toogleSideMenu(false)}
            href="/app/usuarios/listagem"
            label="Usuário do sistema"
            icon={FaUsersCog}
          />
        )}
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/clubes/listagem"
          label="Clubes"
          icon={MdShield}
        />
        <ListItem
          closeModal={() => toogleSideMenu(false)}
          href="/app/federacoes/listagem"
          label="Federações"
          icon={SiGoogleassistant}
        />
        {isAdmin && (
          <>
            <Divider />
            <ListSubtitle label="Área restrita" />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/atletas/aprovacao"
              label="Aprovação de atletas"
              icon={MdChecklist}
            />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/transferencia/listagem/pendentes"
              label="Aprovação de transferências"
              icon={MdChecklist}
            />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/atletas/relatorio"
              label="Relatório de atletas"
              icon={MdInsertDriveFile}
            />
            <ListItem
              closeModal={() => toogleSideMenu(false)}
              href="/app/restrito/transferencia/listagem"
              label="Transferências"
              icon={MdOutlineListAlt}
              end
            />
          </>
        )}
      </div>
    </aside>
  );
}
