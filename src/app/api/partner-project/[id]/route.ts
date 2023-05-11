import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { PartnerProject } from "@prisma/client";
import { NextRequest } from "next/server";

type Body = Omit<
  PartnerProject,
  "id" | "federationId" | "teamId" | "updatedAt" | "createdAt"
>;

export async function GET(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const partnerProject = await prisma.partnerProject.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!partnerProject) {
    return new Response("Projeto não encontrado", { status: 404 });
  }

  return new Response(JSON.stringify(partnerProject), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const partnerProject = await prisma.partnerProject.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!partnerProject) {
    return new Response("Projeto não encontrado", { status: 404 });
  }

  const body = (await req.json()) as Body;

  const updatedPartnerProject = await prisma.partnerProject.update({
    where: {
      id: Number(id),
    },
    data: {
      ...body,
      malePractitioners: Number(body.malePractitioners),
      femalePractitioners: Number(body.femalePractitioners),
      practitioners: Number(body.practitioners),
    },
  });

  return new Response(JSON.stringify(updatedPartnerProject), { status: 200 });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const projectExists = await prisma.partnerProject.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!projectExists) {
    return new Response("Projeto de parceiro não encontrado", { status: 404 });
  }

  await prisma.partnerProject.delete({
    where: {
      id: Number(id),
    },
  });

  return new Response(null, { status: 204 });
}
