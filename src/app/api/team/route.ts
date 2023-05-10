import { prisma } from "@/services/prisma";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
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

export async function POST(req: NextRequest) {
  await authenticationMiddleware();

  const {
    name,
    initials,
    email,
    url,
    presidentName,
    beginningOfTerm,
    endOfTerm,
    coachName,
    description,
    federationId,
    logo,
    presidentDocument,
    teamDocument,
    electionMinutes,
  } = (await req.json()) as FormData;

  if (
    !name ||
    !initials ||
    !email ||
    !url ||
    !presidentName ||
    !beginningOfTerm ||
    !endOfTerm ||
    !coachName ||
    !description ||
    !federationId ||
    !logo ||
    !presidentDocument ||
    !teamDocument ||
    !electionMinutes
  ) {
    return new Response("Dados incorretos", { status: 400 });
  }

  const team = await prisma.team.create({
    data: {
      name,
      initials,
      email,
      url,
      presidentName,
      beginningOfTerm,
      endOfTerm,
      coachName,
      description,
      federationId: Number(federationId),
      logo,
      presidentDocument,
      teamDocument,
      electionMinutes,
    },
  });

  return new Response(JSON.stringify(team), { status: 201 });
}
