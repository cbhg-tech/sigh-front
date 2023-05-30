import { NextRequest } from "next/server";
import { prisma } from "@/services/prisma";
import { getFormData } from "@/utils/getFormData";
import { USER_STATUS, USER_TYPE } from "@prisma/client";
import { authAdmin } from "@/services/firebase-admin";

type FormData = {
  name: string;
  email: string;
  password: string;
  document: string;
  birthDate: string;
  teamId: string;
};

export async function POST(req: NextRequest) {
  const { birthDate, document, email, name, password, teamId } =
    await getFormData<FormData>(req);

  if (!name || !email || !password || !document || !birthDate || !teamId) {
    return new Response("Campos obrigatórios não preenchidos", {
      status: 400,
    });
  }

  const emailExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (emailExists) {
    return new Response("Email já cadastrado", {
      status: 400,
    });
  }

  const documentExists = await prisma.athlete.findFirst({
    where: {
      document,
    },
  });

  if (documentExists) {
    return new Response("Documento já cadastrado", {
      status: 400,
    });
  }

  const firebaseUser = await authAdmin.createUser({
    email,
    password,
    displayName: name,
  });

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      uid: firebaseUser.uid,
      type: USER_TYPE.ATHLETE,
      status: USER_STATUS.PENDING,
      athlete: {
        create: {
          document: document,
          birthDate: birthDate,
          teamId: Number(teamId),
          registerNumber: 1231,
        },
      },
    },
  });

  // @ts-ignore
  delete user.password;

  const redirectUrl = new URL("/app/dashboard", process.env.APP_URL);
  const token = await authAdmin.createSessionCookie(firebaseUser.uid, {
    expiresIn: 60 * 60 * 24 * 5 * 1000,
  });

  console.log(token);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl.toString(),
      "Set-Cookie": `access_token=${token}; path=/; HttpOnly;`,
    },
  });
}
