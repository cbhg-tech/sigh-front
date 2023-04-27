import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "./verifyToken";

export async function authenticationMiddleware() {
  const token = cookies().get("token") as string | undefined;

  if (!token) {
    return redirect("/?error=unauthorized");
  }

  const decoded = verifyToken(token) as { id: number; email: string };

  return decoded;
}
