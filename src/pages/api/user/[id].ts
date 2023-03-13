import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { prisma } from "@/services/prisma";
import { verifyToken } from "@/services/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies["token"];

  if (!token) {
    return res.status(401).send({ error: "Não autorizado" });
  }

  const decoded = verifyToken(token) as { id: number; email: string };

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

  if (req.method === "DELETE") {
    const { id } = req.query;
    const userId = decoded.id;

    if (Number(id) === userId) {
      return res
        .status(400)
        .send({ error: "Não é possível deletar o próprio usuário" });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!userExists) {
      return res.status(404).send({ error: "Usuário não encontrado" });
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).json({});
  }
}
