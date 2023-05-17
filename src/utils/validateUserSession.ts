import { authAdmin } from "@/services/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function validateUserSession() {
  const userCookies = cookies();

  const token = userCookies.get("access_token")?.value as unknown as string;

  if (!token) {
    redirect("/");
  }

  const sessionIsValid = await authAdmin.verifyIdToken(token, true);

  if (!sessionIsValid) {
    redirect("/");
  }
}

export { validateUserSession };
