import Image from "next/image";
import Link from "next/link";
import { FaUsersCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Divider } from "@/components/Divider";
import { validateUserSession } from "@/services/validateUserSession";

const BTN_STYLE =
  "flex items-center p-4 rounded-full gap-3 text-light-on-surface-variant bg-transparent";

const MenuPage = async () => {
  await validateUserSession();

  return (
    <main className="absolute duration-200 ease-in-out lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-surface-1">
      <div className="bg-light-surface-1 overflow-y-auto flex flex-col min-h-screen h-full p-4 lg:rounded-3xl md:pb-20">
        <div className="flex justify-between mb-4">
          <Image
            className="object-contain"
            src="/images/cbhg-logo.png"
            width={80}
            height={45}
            alt="Logo da Federação nacional de hoquei sobre grama"
          />
        </div>
        <div>
          <Link href="/app/dashboard" className={BTN_STYLE}>
            <MdDashboard
              size={24}
              className="text-light-on-secondary-container"
            />
            <p className="flex-1 font-bold">Dashboard</p>
          </Link>
          <Divider />
          <div className="py-5 px-4 text-light-on-surface-variant">
            <p className="font-bold">Cadastros</p>
          </div>
          <Link href="/app/usuarios" className={BTN_STYLE}>
            <FaUsersCog
              size={24}
              className="text-light-on-secondary-container"
            />
            <p className="flex-1 font-bold">Usuários do sistema</p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default MenuPage;
