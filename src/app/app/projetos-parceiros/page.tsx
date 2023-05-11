import { EmptyMessage } from "@/components/EmptyMessage";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { PartnerProject, ROLE, USER_TYPE } from "@prisma/client";
import { userAgent } from "next/server";
import { ListItemAction } from "./ListItemAction";

const HeaderName = [
  {
    name: "Nome do projeto",
    width: "w-1/2 lg:w-1/4",
  },
  {
    name: "Início",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Fim",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Qta de praticantes",
    width: "w-1/2 lg:w-1/5",
  },
  {
    name: "Relacionado",
    width: "hidden lg:table-cell w-1/2 lg:w-1/5",
  },
  {
    name: "",
    width: "w-auto",
  },
];

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

      {partnerProjects.length === 0 ? (
        <EmptyMessage message="Nenhum projeto cadastrado" />
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
              {partnerProjects.map((pp) => (
                <tr
                  className="border-b last:border-none border-slate-200"
                  key={pp.id}
                >
                  <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>{pp.name}</td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {getFormattedDate(pp.initialDate)}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {getFormattedDate(pp.finalDate)}
                  </td>
                  <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>
                    {pp.practitioners}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {pp.team?.name || pp.federation?.name || "CBHG"}
                  </td>
                  <td className={`w-auto py-4 px-2`}>
                    <ListItemAction
                      id={pp.id}
                      currentUser={currentUser!}
                      pp={pp}
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

export default PartnerProjectPage;
