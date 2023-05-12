import { DataList } from "@/components/DataList";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE } from "@prisma/client";

const getPartnerProjects = async () => {
  const partnerProjects = await prisma.partnerProject.findMany({
    include: {
      federation: true,
      team: true,
    },
  });

  return partnerProjects;
};

const PartnerProjectPage = async () => {
  const partnerProjects = await getPartnerProjects();
  const currentUser = await getCurrentUser();

  const canCreate = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN, ROLE.ADMINFEDERATION, ROLE.ADMINTEAM],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Projetos parceiros {`(${partnerProjects.length || 0})`}
        </h2>
        {canCreate && (
          <NavigationButton
            href="/app/projetos-parceiros/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar projeto
          </NavigationButton>
        )}
      </div>

      <DataList
        user={currentUser!}
        data={partnerProjects}
        lineKey="id"
        customEmptyDataMessage="Nenhum projeto cadastrado"
        searchTextKey="name"
        tableSettings={[
          {
            name: "Nome do projeto",
            width: "w-1/2 lg:w-1/4",
            key: "name",
          },
          {
            name: "Início",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "initialDate",
          },
          {
            name: "Fim",
            width: "hidden lg:table-cell lg:w-1/5",
            key: "finalDate",
          },
          {
            name: "Qta de praticantes",
            width: "w-1/2 lg:w-1/5",
            key: "practitioners",
          },
          {
            name: "Relacionado",
            width: "hidden lg:table-cell w-1/2 lg:w-1/5",
            key: "",
            formatter: "ASSOCIATION",
            formatterParam: ["team.name", "federation.name", "CBHG"],
          },
        ]}
        actions={[
          {
            type: "VIEW",
            redirect: "/app/projetos-parceiros/",
          },
          {
            type: "EDIT",
            redirect: "/app/projetos-parceiros/formulario?id=",
            blockBy: "CREATED_BY",
            relationsKey: {
              teamId: "teamId",
              federationId: "federationId",
            },
          },
          {
            type: "DELETE",
            deleteUrl: "/api/partner-project/delete",
            blockBy: "CREATED_BY",
            relationsKey: {
              teamId: "teamId",
              federationId: "federationId",
            },
          },
        ]}
      />
    </div>
  );
};

export default PartnerProjectPage;
