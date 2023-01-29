import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: "Dados incorretos" });
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(400).send({ error: "Usuário não encontrado" });
  }

  const passwordMatch = hashService().compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).send({ error: "Senha" });
  }

  const secret = process.env.JWT_SECRET || "secret";

  const token = jwt.sign({ email }, secret, {
    expiresIn: "1d",
  });

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  await prisma.userSession.create({
    data: {
      token,
      userId: user.id,
      expires_at: new Date(Date.now() + oneDayInMilliseconds),
    },
  });

  return res.status(200).send({ token, user });
}
