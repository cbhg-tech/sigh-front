import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

async function validateUserSession() {
  const userCookies = cookies();

  const token = userCookies.get("token")?.value as unknown as string;

  if (!token) {
    redirect("/");
  }

  const sessionExist = await prisma.userSession.findUnique({
    where: {
      token,
    },
  });

  if (!sessionExist || !sessionExist.isValid) {
    redirect("/");
  }

  if (sessionExist.expires_at < new Date()) {
    await prisma.userSession.update({
      where: {
        id: sessionExist.id,
      },
      data: {
        isValid: false,
      },
    });

    redirect("/");
  }
}

export { validateUserSession };
