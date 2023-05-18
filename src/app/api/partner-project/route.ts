import { prisma } from "@/services/prisma";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { PartnerProject, ROLE } from "@prisma/client";
import { NextRequest } from "next/server";

type Body = Omit<
  PartnerProject,
  "id" | "federationId" | "teamId" | "updatedAt" | "createdAt"
>;

export async function POST(req: NextRequest) {
  const tokenDecoded = await authenticationMiddleware();

  const user = await prisma.user.findUnique({
    where: {
      uid: tokenDecoded.id,
    },
    include: {
      admin: true,
    },
  });

  const body = (await req.json()) as Body;

  const {
    ageGroup,
    description,
    city,
    contactName,
    contactPhone,
    femalePractitioners,
    finalDate,
    initialDate,
    malePractitioners,
    name,
    place,
    practitioners,
    state,
  } = body;

  if (
    !ageGroup ||
    !description ||
    !city ||
    !contactName ||
    !contactPhone ||
    !finalDate ||
    !initialDate ||
    !malePractitioners ||
    !name ||
    !place ||
    !practitioners ||
    !state ||
    !femalePractitioners
  ) {
    return new Response("Dados incorretos", {
      status: 400,
    });
  }

  const partnerProject = await prisma.partnerProject.create({
    data: {
      ...body,
      malePractitioners: Number(malePractitioners),
      femalePractitioners: Number(femalePractitioners),
      practitioners: Number(practitioners),
      federationId:
        user?.admin?.role === ROLE.ADMINFEDERATION
          ? Number(user?.admin?.federationId)
          : null,
      teamId:
        user?.admin?.role === ROLE.ADMINTEAM
          ? Number(user?.admin?.teamId)
          : null,
    },
  });

  return new Response(JSON.stringify(partnerProject), {
    status: 201,
  });
}
