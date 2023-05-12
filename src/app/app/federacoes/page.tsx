import { DataList } from "@/components/DataList";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE } from "@prisma/client";

async function getFederations() {
  const federations = await prisma.federation.findMany({});

  return federations;
}

export default async function FederationsPage() {
  const currentUser = await getCurrentUser();
  const federations = await getFederations();

  const canCreate = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Federações {`(${federations.length || 0})`}
        </h2>
        {canCreate && (
          <NavigationButton
            href="/app/federacoes/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar Federação
          </NavigationButton>
        )}
      </div>

      <DataList
        user={currentUser!}
        data={federations}
        lineKey="id"
        customEmptyDataMessage="Nenhuma federação cadastrada"
        searchTextKey="name"
        tableSettings={[
          {
            name: "Nome",
            width: "w-1/2 lg:w-1/4",
            key: "name",
          },
          {
            name: "Sigla",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "initials",
          },
          {
            name: "Estado",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "uf",
          },
          {
            name: "Presidente",
            width: "hidden lg:table-cell w-1/2 lg:w-1/5",
            key: "presidentName",
          },
        ]}
        actions={[
          {
            type: "VIEW",
            redirect: "/app/federacoes/",
          },
          {
            type: "EDIT",
            redirect: "/app/federacoes/formulario?id=",
            blockBy: "ROLE",
            roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
          },
          {
            type: "DELETE",
            deleteUrl: "/api/federation/",
            blockBy: "ROLE",
            roles: [ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
          },
        ]}
      />
    </div>
  );
}
