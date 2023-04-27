import { prisma } from "@/services/prisma";

export async function GET() {
  const teams = await prisma.team.findMany({
    select: {
      id: true,
      name: true,
      initials: true,
      federation: {
        select: {
          id: true,
          name: true,
          initials: true,
        },
      },
    },
  });

  return new Response(JSON.stringify(teams), { status: 200 });
}
