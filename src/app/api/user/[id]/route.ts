import { authenticationMiddleware } from "@/services/authenticationMiddleware";
import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { ROLE } from "@prisma/client";
import { NextRequest } from "next/server";

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
  const formData = await req.formData();
  const name = formData.get("name") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const role = formData.get("role") as ROLE | undefined;

  if (!name || !email || !role) {
    return new Response("Dados incorretos", { status: 400 });
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

  return new Response(JSON.stringify(user), { status: 200 });
}
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const decoded = await authenticationMiddleware();

  const id = params.id;
  const userId = decoded.id;

  if (Number(id) === userId) {
    return new Response("Não é possível deletar o próprio usuário", {
      status: 400,
    });
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!userExists) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return new Response(null, { status: 204 });
}
