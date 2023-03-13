import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/services/prisma";

type BodyParams = {
  name: string;
  email: string;
  initials: string;
  uf: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  logo: string;
  presidentDocument: string;
  federationDocument: string;
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

  if (req.method === "POST") {
    const {
      name,
      email,
      initials,
      uf,
      presidentName,
      beginningOfTerm,
      endOfTerm,
      logo,
      presidentDocument,
      federationDocument,
      electionMinutes,
    } = req.body as BodyParams;

    if (
      !name ||
      !email ||
      !initials ||
      !uf ||
      !presidentName ||
      !beginningOfTerm ||
      !endOfTerm ||
      !logo ||
      !presidentDocument ||
      !federationDocument ||
      !electionMinutes ||
      !req.body
    ) {
      return res.status(400).send({ error: "Dados incorretos" });
    }

    const federation = await prisma.federation.create({
      data: {
        name,
        email,
        initials,
        uf,
        presidentName,
        beginningOfTerm,
        endOfTerm,
        logo,
        presidentDocument,
        federationDocument,
        electionMinutes,
      },
    });

    return res.status(200).json(federation);
  }
}
