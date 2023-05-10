import { ReactNode } from "react";
import { AsideMenu } from "@/components/AsideMenu";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { validateUserSession } from "@/utils/validateUserSession";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "SIGH | Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

const AppLayout = async ({ children }: { children: ReactNode }) => {
  await validateUserSession();

  const user = await getCurrentUser();

  return (
    <div className="grid grid-cols-5 grid-rows-[64px_1fr] overflow-y-hidden w-full h-screen bg-light-surface-1">
      {user && <Navbar user={user} />}

      <aside className="absolute duration-200 ease-in-out lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-surface-1 hidden lg:block">
        <div className="bg-light-surface-1 overflow-y-auto flex flex-col min-h-screen h-full p-4 lg:rounded-3xl md:pb-20">
          {user && <AsideMenu user={user} />}
        </div>
      </aside>

      <main className="col-span-5 lg:col-span-4 h-full overflow-y-auto">
        <div className=" p-4 bg-light-surface-1 mb-24">
          <div className="bg-light-surface p-6 rounded-2xl">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
