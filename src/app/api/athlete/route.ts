import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";
import { getFormData } from "@/utils/getFormData";
import { USER_STATUS, USER_TYPE } from "@prisma/client";

interface AthleteFormData {
  name: string;
  email: string;
  password: string;
  document: string;
  birthDate: string;
  teamId: string;
  [key: string]: string;
}

export async function POST(req: NextRequest) {
  const data = await getFormData<AthleteFormData>(req);

  if (
    !data.name ||
    !data.email ||
    !data.password ||
    !data.document ||
    !data.birthDate ||
    !data.teamId
  ) {
    return new Response("Campos obrigatórios não preenchidos", {
      status: 400,
    });
  }

  const emailExists = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (emailExists) {
    return new Response("Email já cadastrado", {
      status: 400,
    });
  }

  const documentExists = await prisma.athlete.findFirst({
    where: {
      document: data.document,
    },
  });

  if (documentExists) {
    return new Response("Documento já cadastrado", {
      status: 400,
    });
  }

  const hashed = hashService().generate(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      type: USER_TYPE.ATHLETE,
      status: USER_STATUS.PENDING,
      athlete: {
        create: {
          document: data.document,
          birthDate: data.birthDate,
          teamId: Number(data.teamId),
          registerNumber: 1231,
        },
      },
    },
  });

  const secret = process.env.JWT_SECRET || "secret";

  const token = jwt.sign({ email: data.email }, secret, {
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
