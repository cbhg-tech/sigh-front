import { Badge } from "@/components/Badge";
import { DataList } from "@/components/DataList";
import { EmptyMessage } from "@/components/EmptyMessage";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE, USER_STATUS } from "@prisma/client";
import Link from "next/link";
import { ListItemAction } from "./ListItemAction";

const HeaderName = [
  {
    name: "Nome",
    width: "w-1/2 lg:w-1/5",
  },
  {
    name: "Status",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "RoleAccess",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Associação",
    width: "hidden lg:table-cell w-1/2 lg:w-1/5",
  },
  {
    name: "",
    width: "w-auto",
  },
];

async function getSystemUser() {
  const user = await prisma.user.findMany({
    include: {
      admin: {
        include: {
          federation: true,
          team: true,
        },
      },
    },
  });

  return user.map((user) => {
    // @ts-ignore
    delete user.password;

    return user;
  });
}

const UsersPage = async () => {
  const currentUser = await getCurrentUser();
  const systemUsers = await getSystemUser();

  function translateStatus(status: USER_STATUS) {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return "Ativo";
      case USER_STATUS.INACTIVE:
        return "Inativo";
      default:
      case USER_STATUS.PENDING:
        return "Pendente";
    }
  }

  const isAdmin = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN],
  });

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl text-light-on-surface">Acesso negado</h2>
        <p className="text-light-on-surface">
          Você não tem permissão para acessar essa página
        </p>
        <Link
          className="text-light-on-tertiary-container font-bold underline"
          href="/app/dashboard"
        >
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Usuários do sistema {`(${systemUsers.length || 0})`}
        </h2>
        <NavigationButton
          href="/app/usuarios/formulario"
          additionalClasses="w-full lg:w-auto px-6"
        >
          Criar usuário
        </NavigationButton>
      </div>

      {systemUsers.length === 0 ? (
        <EmptyMessage message="Nenhum usuário cadastrado" />
      ) : (
        <DataList
          user={currentUser!}
          data={systemUsers}
          searchTextKey="name"
          lineKey="id"
          tableSettings={[
            {
              name: "Nome",
              width: "w-1/2 lg:w-1/5",
              key: "name",
            },
            {
              name: "Status",
              width: "hidden lg:table-cell lg:w-1/5",
              key: "status",
            },
            {
              name: "RoleAccess",
              width: "hidden lg:table-cell lg:w-1/5",
              key: "admin.role",
              formatter: "BADGE",
            },
            {
              name: "Associação",
              width: "hidden lg:table-cell w-1/2 lg:w-1/5",
              key: "admin",
              formatter: "ASSOCIATION",
            },
          ]}
          actions={[
            {
              type: "EDIT",
              redirect: "/app/usuarios/formulario?id=",
              blockBy: "ROLE",
              roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
            },
            {
              type: "DELETE",
              deleteUrl: "/api/user/",
              blockBy: "ROLE",
              roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
            },
          ]}
        />
      )}
    </div>
  );
};

export default UsersPage;
