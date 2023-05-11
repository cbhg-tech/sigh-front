import { ReactNode } from "react";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { validateUserSession } from "@/utils/validateUserSession";
import { Navigation } from "@/components/UserNavigation";

export const metadata = {
  title: "SIGH | Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

const AppLayout = async ({ children }: { children: ReactNode }) => {
  await validateUserSession();

  const user = await getCurrentUser();

  return <Navigation user={user!}>{children}</Navigation>;
};

export default AppLayout;
