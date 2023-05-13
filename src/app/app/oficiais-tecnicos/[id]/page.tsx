import { prisma } from "@/services/prisma";
import { NextPage } from "@/types/NextPage";

async function getTechnicalOfficer(id: number) {
  return prisma.technician.findUnique({
    where: {
      id: id,
    },
  });
}

export default async function TechnicalOfficerDetails({
  params: { id },
}: NextPage) {
  const data = await getTechnicalOfficer(Number(id));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-light-on-surface">
        {data?.name}
      </h1>
      <p className="text-light-on-surface-variant">{data?.charge}</p>

      <section className="mt-8">
        <p className="text-light-on-surface-variant">
          <strong className="text-light-on-surface">
            Data de nascimento:{" "}
          </strong>
          {data?.birthDate}
        </p>

        <p className="text-light-on-surface-variant">
          <strong className="text-light-on-surface">Documento: </strong>
          {data?.document}
        </p>

        <p className="text-light-on-surface-variant">
          <strong className="text-light-on-surface">Telefone: </strong>
          {data?.phone}
        </p>

        <p className="text-light-on-surface-variant">
          <strong className="text-light-on-surface">Email: </strong>
          {data?.email}
        </p>
      </section>
    </div>
  );
}
