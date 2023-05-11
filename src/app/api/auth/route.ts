import { hashService } from "@/services/hash";
import { prisma } from "@/services/prisma";
import { getFormData } from "@/utils/getFormData";
import * as jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

type FormData = {
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  const { email, password } = await getFormData<FormData>(req);

  if (!email || !password) {
    return redirect("/?error=data");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return redirect("/?error=user");
  }

  const passwordMatch = hashService().compare(password, user.password);

  if (!passwordMatch) {
    return redirect("/?error=password");
  }

  const secret = process.env.JWT_SECRET || "secret";
  const token = jwt.sign({ email, id: user.id }, secret, {
    expiresIn: "1d",
  });
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  await prisma.userSession.create({
    data: {
      token,
      userId: user.id,
      expires_at: new Date(Date.now() + oneDayInMilliseconds),
    },
  });

  const redirectUrl = new URL("/app/dashboard", process.env.APP_URL);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl.toString(),
      "Set-Cookie": `token=${token}; path=/; expires=${new Date(
        Date.now() + oneDayInMilliseconds
      ).toUTCString()}; HttpOnly;`,
    },
  });
}
