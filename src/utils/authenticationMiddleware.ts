import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authAdmin } from "@/services/firebase-admin";

export async function authenticationMiddleware() {
  const token = cookies().get("access_token")?.value as string | undefined;

  if (!token) {
    return redirect("/?error=unauthorized");
  }

  const res = await authAdmin.verifyIdToken(token, true);

  return { id: res.uid, email: res.email };
}
