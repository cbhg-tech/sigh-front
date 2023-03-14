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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).send({ error: "Não autorizado" });
  }

  if (req.method === "POST") {
    const {
      name,
      email,
      initials,
      presidentName,
      beginningOfTerm,
      endOfTerm,
      logo,
      presidentDocument,
      electionMinutes,
      coachName,
      description,
      federationId,
      teamDocument,
      url,
    } = req.body as BodyParams;

    if (
      !name ||
      !email ||
      !initials ||
      !presidentName ||
      !beginningOfTerm ||
      !endOfTerm ||
      !logo ||
      !presidentDocument ||
      !electionMinutes ||
      !coachName ||
      !description ||
      !federationId ||
      !teamDocument ||
      !url ||
      !req.body
    ) {
      return res.status(400).send({ error: "Dados incorretos" });
    }

    const team = await prisma.team.create({
      data: {
        name,
        email,
        initials,
        presidentName,
        beginningOfTerm,
        endOfTerm,
        description,
        url,
        logo,
        presidentDocument,
        electionMinutes,
        coachName,
        teamDocument,
        federationId: Number(federationId),
      },
    });

    return res.status(200).json(team);
  }
}
