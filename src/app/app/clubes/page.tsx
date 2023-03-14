import { EmptyMessage } from "@/components/EmptyMessage";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { getCurrentUser } from "@/services/getCurrentUser";
import { prisma } from "@/services/prisma";
import { verifyUserRole } from "@/services/verifyUserRole";
import { ROLE } from "@prisma/client";
import { ListItemAction } from "./ListItemAction";

const HeaderName = [
  {
    name: "Nome",
    width: "w-1/2 lg:w-1/4",
  },
  {
    name: "Federação",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Email",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Presidente",
    width: "hidden lg:table-cell w-1/2 lg:w-1/5",
  },
  {
    name: "",
    width: "w-auto",
  },
];

async function getTeams() {
  const teams = await prisma.team.findMany({
    include: {
      federation: true,
    },
  });

  return teams;
}

const TeamsPage = async () => {
  const currentUser = await getCurrentUser();
  const teams = await getTeams();

  const canCreateAndEdit = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de clubes {`(${teams.length || 0})`}
        </h2>
        {canCreateAndEdit && (
          <NavigationButton
            href="/app/clubes/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar clube
          </NavigationButton>
        )}
      </div>

      {teams.length === 0 ? (
        <EmptyMessage message="Nenhum clube cadastrado" />
      ) : (
        <>
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
              {teams.map((team) => (
                <tr
                  className="border-b last:border-none border-slate-200"
                  key={team.id}
                >
                  <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>{team.name}</td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {team.federation.initials}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {team.email}
                  </td>
                  <td
                    className={`hidden lg:table-cell w-1/2 lg:w-1/5 py-4 px-2`}
                  >
                    {team.presidentName}
                  </td>
                  <td className={`w-auto py-4 px-2`}>
                    <ListItemAction
                      id={team.id}
                      enableEdit={canCreateAndEdit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TeamsPage;
