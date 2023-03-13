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

  if (req.method === "PUT") {
    const { id } = req.query;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).send({ error: "Dados incorretos" });
    }

    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        admin: {
          update: {
            role,
          },
        },
      },
    });

    return res.status(200).json(user);
  }
}
