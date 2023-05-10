import { prisma } from "@/services/prisma";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
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

export async function POST(req: NextRequest) {
  await authenticationMiddleware();

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
  } = (await req.json()) as FormData;

  if (
    !beginningOfTerm ||
    !electionMinutes ||
    !email ||
    !endOfTerm ||
    !federationDocument ||
    !initials ||
    !logo ||
    !name ||
    !presidentDocument ||
    !presidentName ||
    !uf
  ) {
    return new Response("Dados incorretos", { status: 400 });
  }

  const federation = await prisma.federation.create({
    data: {
      name,
      initials,
      uf,
      email,
      presidentName,
      beginningOfTerm,
      endOfTerm,
      logo,
      presidentDocument,
      federationDocument,
      electionMinutes,
    },
  });

  return new Response(JSON.stringify(federation), { status: 201 });
}
