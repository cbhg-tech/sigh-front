import { authAdmin } from "@/services/firebase-admin";
import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { ROLE } from "@prisma/client";
import { NextRequest } from "next/server";

type FormData = {
  name: string;
  email: string;
  role: ROLE;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      admin: true,
    },
  });

  if (!user) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const { email, name, role } = (await req.json()) as FormData;

  if (!name || !email || !role) {
    return new Response("Dados incorretos", { status: 400 });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!userExists) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  await authAdmin.updateUser(userExists.uid, {
    displayName: name,
    email,
  });

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

  return new Response(JSON.stringify(user), { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const decoded = await authenticationMiddleware();

  const id = params.id;
  const userId = decoded.id;

  const userExists = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!userExists) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  if (userExists.uid === userId) {
    return new Response("Não é possível deletar o próprio usuário", {
      status: 400,
    });
  }

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return new Response(null, { status: 204 });
}
