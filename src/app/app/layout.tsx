import { ReactNode } from "react";
import Image from "next/image";
import { validateUserSession } from "@/services/validateUserSession";
import { AsideMenu } from "@/components/AsideMenu";
import { MdOutlineMenu } from "react-icons/md";
import Link from "next/link";
import { getCurrentUser } from "@/services/getCurrentUser";

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
      <header className="items-center justify-between px-4 col-span-5 bg-light-surface-1 flex">
        <div className="flex items-center lg:hidden">
          <Link href="/menu">
            <MdOutlineMenu size="2.25rem" />
          </Link>
        </div>

        <Image
          className="object-contain hidden lg:block"
          src="/images/cbhg-logo.png"
          width={80}
          height={45}
          alt="Logo da Federação nacional de hoquei sobre grama"
        />

        <h1 className="text-xl text-light-on-surface-variant hidden lg:block">
          Dashboard
        </h1>

        <button
          type="button"
          className="w-auto h-9 rounded-full flex gap-4 items-center text-light-on-surface-variant"
        >
          {user?.name}
          <Image
            // src={user?.photoUrl || USER_NOT_FOUND_IMG}
            src="/images/user-img.jpg"
            alt={user?.name || "Usuário não encontrado"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </button>
      </header>

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
