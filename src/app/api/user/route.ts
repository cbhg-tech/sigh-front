import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";
import { authenticationMiddleware } from "@/utils/authenticationMiddleware";
import { getFormData } from "@/utils/getFormData";
import { ROLE, USER_STATUS, USER_TYPE } from "@prisma/client";
import { NextRequest } from "next/server";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: ROLE;
  related: string;
};

export async function POST(req: NextRequest) {
  await authenticationMiddleware();

  const { email, name, password, related, role } =
    (await req.json()) as FormData;

  if (!name || !email || !password || !role || !req.body) {
    return new Response("Dados incorretos", { status: 400 });
  }

  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists) {
    return new Response("Email já cadastrado", { status: 400 });
  }

  if (!Object.values(ROLE).includes(role)) {
    return new Response("Role inválida", { status: 400 });
  }

  const hashed = hashService().generate(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      type: USER_TYPE.ADMIN,
      status: USER_STATUS.ACTIVE,
      admin: {
        create: {
          role: ROLE[role as keyof typeof ROLE],
          federationId: role === ROLE.ADMINFEDERATION ? Number(related) : null,
          teamId: role === ROLE.ADMINTEAM ? Number(related) : null,
        },
      },
    },
  });

  // @ts-ignore
  delete user.password;

  return new Response(JSON.stringify(user), { status: 200 });
}
