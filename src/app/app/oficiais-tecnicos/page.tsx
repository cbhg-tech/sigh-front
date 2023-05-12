import { DataList } from "@/components/DataList";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { ROLE, TECHNICIAN_TYPE } from "@prisma/client";

async function getTechniciansOfficers() {
  return prisma.technician.findMany({
    where: {
      type: TECHNICIAN_TYPE.OFFICIAL,
    },
  });
}

export default async function TechnicalOfficers() {
  const currentUser = await getCurrentUser();
  const techniciansOfficers = await getTechniciansOfficers();

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Oficiais Técnicos {`(${techniciansOfficers.length || 0})`}
        </h2>
        <NavigationButton
          href="/app/oficiais-tecnicos/formulario"
          additionalClasses="w-full lg:w-auto px-6"
        >
          Criar oficial tecnico
        </NavigationButton>
      </div>

      <DataList
        user={currentUser!}
        data={techniciansOfficers}
        searchTextKey="name"
        lineKey="id"
        customEmptyDataMessage="Nenhum oficial cadastrado"
        tableSettings={[
          {
            name: "Nome",
            width: "w-1/2 lg:w-1/5",
            key: "name",
          },
          {
            name: "Phone",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "phone",
          },
          {
            name: "Email",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "email",
          },
        ]}
        actions={[
          {
            type: "VIEW",
            redirect: "/app/oficiais-tecnicos/",
          },
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
    </div>
  );
}
