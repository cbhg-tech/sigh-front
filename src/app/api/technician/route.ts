import { prisma } from "@/services/prisma";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { TECHNICIAN_TYPE } from "@prisma/client";
import { NextRequest } from "next/server";

export interface Body {
  name: string;
  email: string;
  phone: string;
  gender: string;
  charge: string;
  birthDate: string;
  document: string;
  documentFile: string;
  teamId?: string;
  type: TECHNICIAN_TYPE;
}

export async function POST(req: NextRequest) {
  await authenticationMiddleware();

  const body = (await req.json()) as Body;
  const {
    birthDate,
    charge,
    document,
    documentFile,
    email,
    gender,
    name,
    phone,
    type,
    teamId,
  } = body;

  if (
    !birthDate ||
    !charge ||
    !document ||
    !documentFile ||
    !email ||
    !gender ||
    !name ||
    !phone ||
    !type
  ) {
    return new Response("Dados inválidos", {
      status: 400,
    });
  }

  const technician = await prisma.technician.create({
    data: {
      ...body,
      teamId: teamId ? Number(teamId) : null,
    },
  });

  return new Response(JSON.stringify(technician), {
    status: 201,
  });
}
