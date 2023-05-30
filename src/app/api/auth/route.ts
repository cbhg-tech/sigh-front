import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { authAdmin } from "@/services/firebase-admin";

interface Body {
  token: string;
  csrfToken: string;
}

export async function POST(req: NextRequest) {
  const { token, csrfToken } = (await req.json()) as Body;
  const cookieCsrfToken = cookies().get("csrf_token")?.value;

  if (csrfToken !== cookieCsrfToken) {
    return new Response("CSRF inválido", {
      status: 403,
    });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  const sessionToken = await authAdmin.createSessionCookie(token, {
    expiresIn,
  });

  const cookieOptions = {
    path: "/",
    secure: true,
    sameSite: "strict",
    httpOnly: true,
  };

  const cookieOptionsString = Object.entries(cookieOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return new Response("Autenticado", {
    status: 200,
    headers: {
      "Set-Cookie": `access_token=${sessionToken}; ${cookieOptionsString}`,
    },
  });
}
