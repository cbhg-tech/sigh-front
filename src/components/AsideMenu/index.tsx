"use client";

import { MdDashboard, MdShield } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { Divider } from "../Divider";
import { NavigationItem } from "./NavigationItem";
import { UserComplete } from "@/types/UserComplete";
import { verifyUserRole } from "@/services/verifyUserRole";
import { ROLE } from "@prisma/client";

const AsideMenu = ({ user }: { user: UserComplete }) => {
  const isAdmin = verifyUserRole({
    user,
    roles: [ROLE.ADMIN],
  });

  return (
    <div>
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
        href="/app/federacoes"
        label="Federações"
        icon={MdShield}
      />
      {isAdmin && (
        <NavigationItem
          href="/app/usuarios"
          label="Usuários do sistema"
          icon={FaUsersCog}
        />
      )}
    </div>
  );
};

export { AsideMenu };
