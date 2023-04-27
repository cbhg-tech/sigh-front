import { prisma } from "@/services/prisma";

export async function GET() {
  const federations = await prisma.federation.findMany({
    select: {
      id: true,
      name: true,
      initials: true,
    },
  });

  return new Response(JSON.stringify(federations), { status: 200 });
}
