import { EmptyMessage } from "@/components/EmptyMessage";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { prisma } from "@/services/prisma";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE } from "@prisma/client";
import { ListItemAction } from "./ListItemAction";
// import { ListItemAction } from "./ListItemAction";

const HeaderName = [
  {
    name: "Nome",
    width: "w-1/2 lg:w-1/4",
  },
  {
    name: "Sigla",
    width: "hidden lg:table-cell lg:w-1/5",
  },
  {
    name: "Estado",
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

async function getFederations() {
  const federations = await prisma.federation.findMany({});

  return federations;
}

const FederationsPage = async () => {
  const currentUser = await getCurrentUser();
  const federations = await getFederations();

  const canCreateAndEdit = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMIN],
  });

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-xl md:text-3xl text-light-on-surface">
          Federações {`(${federations.length || 0})`}
        </h2>
        {canCreateAndEdit && (
          <NavigationButton
            href="/app/federacoes/formulario"
            additionalClasses="w-full lg:w-auto px-6"
          >
            Criar Federação
          </NavigationButton>
        )}
      </div>

      {federations.length === 0 ? (
        <EmptyMessage message="Nenhuma federação cadastrada" />
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
              {federations.map((fed) => (
                <tr
                  className="border-b last:border-none border-slate-200"
                  key={fed.id}
                >
                  <td className={`w-1/2 lg:w-1/5 py-4 px-2`}>{fed.name}</td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {fed.initials}
                  </td>
                  <td className={`hidden lg:table-cell lg:w-1/5 py-4 px-2`}>
                    {fed.uf}
                  </td>
                  <td
                    className={`hidden lg:table-cell w-1/2 lg:w-1/5 py-4 px-2`}
                  >
                    {fed.presidentName}
                  </td>
                  <td className={`w-auto py-4 px-2`}>
                    <ListItemAction id={fed.id} enableEdit={canCreateAndEdit} />
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

export default FederationsPage;
