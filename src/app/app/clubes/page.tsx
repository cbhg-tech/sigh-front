import { DataList } from "@/components/DataList";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE } from "@prisma/client";

async function getTeams() {
  const teams = await prisma.team.findMany({
    include: {
      federation: true,
    },
  });

  return teams;
}

export default async function TeamsPage() {
  const currentUser = await getCurrentUser();
  const teams = await getTeams();

  const canCreate = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Clubes {`(${teams.length || 0})`}
        </h2>
        {canCreate && (
          <NavigationButton
            href="/app/clubes/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar clube
          </NavigationButton>
        )}
      </div>

      <DataList
        user={currentUser!}
        data={teams}
        lineKey="id"
        customEmptyDataMessage="Nenhum clube cadastrado"
        searchTextKey="name"
        tableSettings={[
          {
            name: "Nome",
            width: "w-1/2 lg:w-1/4",
            key: "name",
          },
          {
            name: "Federação",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "federation.initials",
          },
          {
            name: "Email",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "email",
          },
          {
            name: "Presidente",
            width: "hidden lg:table-cell w-1/2 lg:w-1/5",
            key: "presidentName",
          },
        ]}
        actions={[
          {
            type: "EDIT",
            redirect: "/app/clubes/formulario?id=",
            blockBy: "ROLE",
            roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
          },
          {
            type: "DELETE",
            deleteUrl: "/api/team/",
            blockBy: "ROLE",
            roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
          },
        ]}
      />
    </div>
  );
}
