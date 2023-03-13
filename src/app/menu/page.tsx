import Image from "next/image";
import { validateUserSession } from "@/services/validateUserSession";
import { getCurrentUser } from "@/services/getCurrentUser";
import { AsideMenu } from "@/components/AsideMenu";

const MenuPage = async () => {
  await validateUserSession();

  const user = await getCurrentUser();

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
        <div>{user && <AsideMenu user={user} />}</div>
      </div>
    </main>
  );
};

export default MenuPage;
