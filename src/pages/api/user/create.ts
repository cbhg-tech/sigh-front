import { ROLE, USER_STATUS, USER_TYPE } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";

import { prisma } from "@/services/prisma";
import { hashService } from "@/services/hash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role || !req.body) {
      return res.status(400).send({ error: "Dados incorretos" });
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailExists) {
      return res.status(400).send({ error: "Email já cadastrado" });
    }

    if (!Object.values(ROLE).includes(role)) {
      return res.status(400).send({ error: "Role inválida" });
    }

    const hashed = hashService().generate(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        type: USER_TYPE.ADMIN,
        status: USER_STATUS.ACTIVE,
        admin: {
          create: {
            role: ROLE[role as keyof typeof ROLE],
          },
        },
      },
    });

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

    // @ts-ignore
    delete user.password;

    return res.status(200).json({ token, user });
  }
}
