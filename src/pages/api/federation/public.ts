import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/services/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const federations = await prisma.federation.findMany({
    select: {
      id: true,
      name: true,
      initials: true,
    },
  });

  return res.status(200).json(federations);
}
