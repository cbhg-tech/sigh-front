import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/services/prisma";

type BodyParams = {
  name: string;
  initials: string;
  email: string;
  url: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federationId: string;
  logo: string;
  presidentDocument: string;
  teamDocument: string;
  electionMinutes: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).send({ error: "Não autorizado" });
  }

  if (req.method === "GET") {
    const { id } = req.query;

    const team = await prisma.team.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!team) {
      return res.status(404).send({ error: "Clube não encontrado" });
    }

    return res.status(200).json(team);
  }

  if (req.method === "PUT") {
    const { id } = req.query;

    const federation = await prisma.team.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!federation) {
      return res.status(404).send({ error: "Clube não encontrado" });
    }

    const {
      name,
      beginningOfTerm,
      electionMinutes,
      email,
      endOfTerm,
      initials,
      logo,
      presidentDocument,
      presidentName,
      coachName,
      description,
      federationId,
      teamDocument,
      url,
    } = req.body as BodyParams;

    const teamUpdated = await prisma.team.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        beginningOfTerm,
        electionMinutes,
        email,
        endOfTerm,
        initials,
        logo,
        presidentDocument,
        presidentName,
        coachName,
        description,
        federationId: Number(federationId),
        teamDocument,
        url,
      },
    });

    return res.status(200).json(teamUpdated);
  }
}
