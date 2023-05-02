import { prisma } from "@/services/prisma";
import { RouteParams } from "@/types/RouteParams";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { getFormData } from "@/utils/getFormData";
import { NextRequest } from "next/server";

type FormData = {
  name: string;
  email: string;
  initials: string;
  uf: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  logo: string;
  presidentDocument: string;
  federationDocument: string;
  electionMinutes: string;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  await authenticationMiddleware();

  const id = params.id;

  const federation = await prisma.federation.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!federation) {
    return new Response("Federação não encontrado", { status: 404 });
  }

  return new Response(JSON.stringify(federation), { status: 200 });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const id = params.id;

  const federation = await prisma.federation.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!federation) {
    return new Response("Federação não encontrado", { status: 404 });
  }

  const {
    beginningOfTerm,
    electionMinutes,
    email,
    endOfTerm,
    federationDocument,
    initials,
    logo,
    name,
    presidentDocument,
    presidentName,
    uf,
  } = await getFormData<FormData>(req);

  const federationUpdated = await prisma.federation.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      beginningOfTerm,
      electionMinutes,
      email,
      endOfTerm,
      federationDocument,
      initials,
      logo,
      presidentDocument,
      presidentName,
      uf,
    },
  });

  return new Response(JSON.stringify(federationUpdated), { status: 200 });
}
