import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";
import { getFormData } from "@/utils/getFormData";
import { USER_STATUS, USER_TYPE } from "@prisma/client";

type FormData = {
  name: string;
  email: string;
  password: string;
  document: string;
  birthDate: string;
  teamId: string;
};

export async function POST(req: NextRequest) {
  const { birthDate, document, email, name, password, teamId } =
    await getFormData<FormData>(req);

  if (!name || !email || !password || !document || !birthDate || !teamId) {
    return new Response("Campos obrigatórios não preenchidos", {
      status: 400,
    });
  }

  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists) {
    return new Response("Email já cadastrado", {
      status: 400,
    });
  }

  const documentExists = await prisma.athlete.findFirst({
    where: {
      document,
    },
  });

  if (documentExists) {
    return new Response("Documento já cadastrado", {
      status: 400,
    });
  }

  const hashed = hashService().generate(password);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashed,
      type: USER_TYPE.ATHLETE,
      status: USER_STATUS.PENDING,
      athlete: {
        create: {
          document: document,
          birthDate: birthDate,
          teamId: Number(teamId),
          registerNumber: 1231,
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

  return NextResponse.json({
    token,
    user,
  });
}
