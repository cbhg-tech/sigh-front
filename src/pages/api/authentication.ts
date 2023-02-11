import type { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  console.log("email: ", email);
  console.log("password: ", password);

  if (!email || !password) {
    return res.redirect("/?error=Dados incorretos");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.redirect("/?error=Usuário não encontrado");
  }

  const passwordMatch = hashService().compare(password, user.password);

  if (!passwordMatch) {
    // return res.status(400).json({ error: "Senha não confere" });
    return res.redirect("/?error=Senha não confere");
  }

  const secret = process.env.JWT_SECRET || "secret";

  const token = jwt.sign({ email, id: user.id }, secret, {
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

  res.setHeader(
    "Set-Cookie",
    `token=${token}; path=/; expires=${new Date(
      Date.now() + oneDayInMilliseconds
    ).toUTCString()}`
  );

  return res.redirect("/app/dashboard");
}
