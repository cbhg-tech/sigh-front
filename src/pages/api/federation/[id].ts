import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/services/prisma";
import { verifyToken } from "@/services/verifyToken";

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

  if (req.method === "GET") {
    const { id } = req.query;

    const federation = await prisma.federation.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!federation) {
      return res.status(404).send({ error: "Federação não encontrado" });
    }

    return res.status(200).json(federation);
  }

  if (req.method === "PUT") {
    const { id } = req.query;

    const federation = await prisma.federation.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!federation) {
      return res.status(404).send({ error: "Federação não encontrado" });
    }

    const {
      name,
      beginningOfTerm,
      electionMinutes,
      email,
      endOfTerm,
      federationDocument,
      initials,
      logo,
      presidentDocument,
      presidentName,
      uf,
    } = req.body as BodyParams;

    const federationUpdated = await prisma.federation.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        beginningOfTerm,
        electionMinutes,
        email,
        endOfTerm,
        federationDocument,
        initials,
        logo,
        presidentDocument,
        presidentName,
        uf,
      },
    });

    return res.status(200).json(federationUpdated);
  }
}
