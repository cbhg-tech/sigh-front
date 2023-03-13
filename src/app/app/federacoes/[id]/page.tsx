import { prisma } from "@/services/prisma";
import { NextPage } from "@/types/NextPage";
import Image from "next/image";
import { MdFormatListBulleted, MdInfo, MdLink } from "react-icons/md";

async function getFederationDetail(id: number) {
  const federation = await prisma.federation.findUnique({
    where: {
      id: id,
    },
    include: {
      teams: true,
    },
  });

  return federation;
}

const FederationDetailPage = async ({ params: { id } }: NextPage) => {
  const federation = await getFederationDetail(Number(id));

  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <figure className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container">
          <Image
            className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
            src={federation?.logo || "/images/image-not-found.png"}
            alt="Logo da federação"
            width={96}
            height={96}
          />
        </figure>
        <h2 className="text-4xl text-light-on-surface-variant">
          {federation?.name} - {federation?.initials}
        </h2>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <MdInfo
            size="1.75rem"
            className="text-light-on-surface-variant mt-1"
          />
          <h3 className="text-3xl text-light-on-surface-variant">Detalhes</h3>
        </div>
        <div className="pl-11">
          <p className="text-light-on-surface-variant">
            <strong>Presidente: </strong>
            {federation?.presidentName}
          </p>
          <p className="text-light-on-surface-variant">
            <strong>Mandato: </strong>
            {new Date(federation!.beginningOfTerm).toLocaleDateString("pt-BR", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}

            {" - "}

            {new Date(federation!.endOfTerm).toLocaleDateString("pt-BR", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <MdFormatListBulleted
            size="1.75rem"
            className="text-light-on-surface-variant"
          />
          <h3 className="text-3xl text-light-on-surface-variant">Clubes</h3>
        </div>
        <div className="pl-11">
          {federation?.teams.length === 0 ? (
            <p className="text-light-on-surface-variant">
              Não há clubes cadastrados para essa federação.
            </p>
          ) : (
            <ul>
              {federation?.teams.map((team) => (
                <li
                  className="py-4 flex gap-2 items-center text-light-on-surface-variant border-b border-light-outline last:border-none"
                  key={team.id}
                >
                  <Image
                    className="w-12 h-12 z-0 rounded-full object-cover bg-light-secondary-container"
                    src={team.logo || "/images/image-not-found.png"}
                    alt={team.name}
                    width={48}
                    height={48}
                  />
                  <p>{team.name}</p>
                  {/* TODO: adicionar link redirecionando para detalhes do time */}
                  <MdLink size="1.25rem" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FederationDetailPage;
