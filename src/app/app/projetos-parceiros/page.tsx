import { EmptyMessage } from "@/components/EmptyMessage";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { PartnerProject, ROLE, USER_TYPE } from "@prisma/client";
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

  const canDeleteOrEdit = (pp: PartnerProject) => {
    if (currentUser?.type === USER_TYPE.ATHLETE) return false;

    if (
      currentUser?.admin?.role === ROLE.ADMIN &&
      !pp.teamId &&
      !pp.federationId
    )
      return true;

    if (
      currentUser?.admin?.federationId === pp.federationId ||
      currentUser?.admin?.teamId === pp.teamId
    ) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Projetos parceiros {`(${partnerProjects.length || 0})`}
        </h2>
        <NavigationButton
          href="/app/projetos-parceiros/formulario"
          additionalClasses="w-full lg:w-auto px-6"
        >
          Criar projeto
        </NavigationButton>
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
                    {pp.initialDate}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {pp.finalDate}
                  </td>
                  <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>
                    {pp.practitioners}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {pp.team.name || pp.federation.name || "CBHG"}
                  </td>
                  <td className={`w-auto py-4 px-2`}>
                    <ListItemAction
                      id={pp.id}
                      enableAction={canDeleteOrEdit(pp)}
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
