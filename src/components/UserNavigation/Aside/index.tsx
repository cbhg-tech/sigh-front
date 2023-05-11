import { MdDashboard, MdGroups, MdGroupWork, MdShield } from "react-icons/md";
import { SiGoogleassistant } from "react-icons/si";
import { FaUsersCog } from "react-icons/fa";
import { Divider } from "../../Divider";
import { NavigationItem } from "./NavigationItem";
import { UserComplete } from "@/types/UserComplete";
import { ROLE } from "@prisma/client";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { Dispatch, SetStateAction, useEffect } from "react";
import { usePathname } from "next/navigation";

export const Aside = ({
  user,
  isMenuOpen,
  toogleSideMenu,
}: {
  user: UserComplete;
  isMenuOpen: boolean;
  toogleSideMenu: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();

  const isOpenStyle = isMenuOpen ? "translate-x-0" : "-translate-x-full";

  const isAdmin = verifyUserRole({
    user,
    roles: [ROLE.ADMIN],
  });

  useEffect(() => {
    if (isMenuOpen) {
      toogleSideMenu(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside
      className={`absolute duration-200 ease-in-out ${isOpenStyle} lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-surface-1`}
    >
      <div className="bg-light-surface-1 overflow-y-auto flex flex-col min-h-screen h-full p-4 lg:rounded-3xl md:pb-20">
        <NavigationItem
          href="/app/dashboard"
          label="Dashboard"
          icon={MdDashboard}
        />
        <Divider />
        <div className="py-5 px-4 text-light-on-surface-variant">
          <p className="font-bold">Cadastros</p>
        </div>
        <NavigationItem
          href="/app/projetos-parceiros"
          label="Projetos Parceiros"
          icon={MdGroupWork}
        />
        <NavigationItem
          href="/app/oficiais-tecnicos"
          label="Oficiais Técnicos"
          icon={MdGroups}
        />
        <NavigationItem href="/app/clubes" label="Clubes" icon={MdShield} />
        <NavigationItem
          href="/app/federacoes"
          label="Federações"
          icon={SiGoogleassistant}
        />
        {isAdmin && (
          <NavigationItem
            href="/app/usuarios"
            label="Usuários do sistema"
            icon={FaUsersCog}
          />
        )}
      </div>
    </aside>
  );
};
