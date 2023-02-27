import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/services/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        admin: true,
      },
    });

    if (!user) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  }
}
