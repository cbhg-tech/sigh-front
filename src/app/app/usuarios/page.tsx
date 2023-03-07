import { Badge } from "@/components/Badge";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { USER_STATUS } from "@prisma/client";
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
      admin: true,
    },
  });

  return user.map((user) => {
    // @ts-ignore
    delete user.password;

    return user;
  });
}

const UsersPage = async () => {
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

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de usuários {`(${0})`}
        </h2>
        <NavigationButton
          href="/app/usuarios/formulario"
          additionalClasses="w-full lg:w-auto px-6"
        >
          Criar usuário
        </NavigationButton>
      </div>

      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <form className="w-full lg:w-1/3">
          <Textfield label="Buscar..." name="search" id="search" />
        </form>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            {HeaderName.map((header) => (
              <th
                className={`${header.width} text-left py-4 px-2 bg-slate-100`}
                key={header.name}
              >
                {header.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {systemUsers.map((user) => (
            <tr
              className="border-b last:border-none border-slate-200"
              key={user.id}
            >
              <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>{user.name}</td>
              <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                {translateStatus(user.status)}
              </td>
              <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                <Badge type="tertiary">{user.admin?.role}</Badge>
              </td>
              <td className={`hidden lg:table-cell w-1/2 lg:w-1/5 py-4 px-2`}>
                {/* {user.admin.} */}
                ADMIN
              </td>
              <td className={`w-auto py-4 px-2`}>
                <ListItemAction id={user.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
