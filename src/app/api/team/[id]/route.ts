import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { getFormData } from "@/utils/getFormData";
import { NextRequest } from "next/server";

type FormData = {
  name: string;
  initials: string;
  email: string;
  url: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federationId: string;
  logo: string;
  presidentDocument: string;
  teamDocument: string;
  electionMinutes: string;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const team = await prisma.team.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!team) {
    return new Response("Clube não encontrado", { status: 404 });
  }

  return new Response(JSON.stringify(team), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const federation = await prisma.team.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!federation) {
    return new Response("Clube não encontrado", { status: 404 });
  }

  const {
    name,
    beginningOfTerm,
    electionMinutes,
    email,
    endOfTerm,
    initials,
    logo,
    presidentDocument,
    presidentName,
    coachName,
    description,
    federationId,
    teamDocument,
    url,
  } = (await req.json()) as FormData;

  const teamUpdated = await prisma.team.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      beginningOfTerm,
      electionMinutes,
      email,
      endOfTerm,
      initials,
      logo,
      presidentDocument,
      presidentName,
      coachName,
      description,
      federationId: Number(federationId),
      teamDocument,
      url,
    },
  });

  return new Response(JSON.stringify(teamUpdated), { status: 200 });
}
