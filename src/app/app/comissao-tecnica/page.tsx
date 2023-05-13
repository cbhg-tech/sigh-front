import { DataList } from "@/components/DataList";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE, TECHNICIAN_TYPE } from "@prisma/client";

async function getTechnicalCommittee() {
  return prisma.technician.findMany({
    where: {
      type: TECHNICIAN_TYPE.COMMITTEE,
    },
  });
}

export default async function TechnicalCommittee() {
  const currentUser = await getCurrentUser();
  const technicians = await getTechnicalCommittee();

  const isTeam = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMINTEAM],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Comissão Técnica {`(${technicians.length || 0})`}
        </h2>
        {isTeam && (
          <NavigationButton
            href="/app/oficiais-tecnicos/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar comissão técnica
          </NavigationButton>
        )}
      </div>

      <DataList
        user={currentUser!}
        data={technicians}
        searchTextKey="name"
        lineKey="id"
        customEmptyDataMessage="Nenhum comitê técnico cadastrado"
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
            redirect: "/app/comissao-tecnica/",
          },
          {
            type: "EDIT",
            redirect: "/app/comissao-tecnica/formulario?id=",
            blockBy: "CREATED_BY",
            relationsKey: {
              teamId: "teamId",
            },
          },
          {
            type: "DELETE",
            deleteUrl: "/api/technician/",
            blockBy: "CREATED_BY",
            relationsKey: {
              teamId: "teamId",
            },
          },
        ]}
      />
    </div>
  );
}
