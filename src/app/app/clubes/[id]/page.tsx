import { prisma } from "@/services/prisma";
import { NextPage } from "@/types/NextPage";
import Image from "next/image";
import { MdInfo } from "react-icons/md";

async function getTeamDetail(id: number) {
  const team = await prisma.team.findUnique({
    where: {
      id: id,
    },
    include: {
      federation: true,
    },
  });

  return team;
}

const TeamDetailPage = async ({ params: { id } }: NextPage) => {
  const team = await getTeamDetail(Number(id));

  return (
    <div>
      <div className="flex gap-4 items-center mb-4">
        <figure className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container">
          <Image
            className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
            src={team?.logo || "/images/image-not-found.png"}
            alt="Logo da federação"
            width={96}
            height={96}
          />
        </figure>
        <div>
          <h2 className="text-4xl text-light-on-surface-variant">
            {team?.name} - {team?.initials}
          </h2>
          <p className="text-light-on-surface-variant">{team?.email}</p>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <MdInfo size="1.75rem" className="text-light-on-surface-variant mt-1" />
          <h3 className="text-3xl text-light-on-surface-variant">Detalhes</h3>
        </div>
        <div className="pl-11">
          <p className="text-light-on-surface-variant">
            <strong>Presidente: </strong>
            {team?.presidentName}
          </p>
          <p className="text-light-on-surface-variant">
            <strong>Mandato: </strong>
            {new Date(team!.beginningOfTerm).toLocaleDateString("pt-BR", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}

            {" - "}

            {new Date(team!.endOfTerm).toLocaleDateString("pt-BR", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}
          </p>
          <p className="text-light-on-surface-variant">
            <strong>Treinador: </strong>
            {team?.coachName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
