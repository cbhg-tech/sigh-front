import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
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
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const technician = await prisma.technician.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!technician) {
    return new Response("Técnico não encontrado", { status: 404 });
  }

  return new Response(JSON.stringify(technician), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

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
  } = body;

  if (
    !birthDate ||
    !charge ||
    !document ||
    !documentFile ||
    !email ||
    !gender ||
    !name ||
    !phone
  ) {
    return new Response("Dados inválidos", {
      status: 400,
    });
  }

  const technician = await prisma.technician.update({
    where: {
      id: Number(id),
    },
    data: {
      ...body,
    },
  });

  return new Response(JSON.stringify(technician), {
    status: 200,
  });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const exists = await prisma.technician.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!exists) {
    return new Response("Técnico não encontrado", { status: 404 });
  }

  await prisma.technician.delete({
    where: {
      id: Number(id),
    },
  });

  return new Response("Técnico deletado com sucesso", { status: 204 });
}
