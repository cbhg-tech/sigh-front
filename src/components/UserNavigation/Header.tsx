import { UserComplete } from "@/types/UserComplete";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { IconButton } from "../Inputs/IconButton";

interface NavbarParams {
  user: UserComplete;
  toogleSideMenu: Dispatch<SetStateAction<boolean>>;
}

export function Header({ user, toogleSideMenu }: NavbarParams) {
  const { replace } = useRouter();

  return (
    <header className="items-center justify-between px-4 col-span-5 bg-light-surface-1 flex">
      <div className="flex items-center gap-2">
        <div className="flex items-center lg:hidden">
          <IconButton
            icon={MdOutlineMenu}
            size="2.25rem"
            onClick={() => toogleSideMenu(true)}
          />
        </div>
        <Image
          className="object-contain hidden lg:block"
          src="/images/cbhg-logo.png"
          width={80}
          height={45}
          alt="Logo da Federação nacional de hoquei sobre grama"
        />
      </div>

      <div className="w-auto h-9 rounded-full flex gap-4 items-center text-light-on-surface-variant relative group">
        {user?.name}
        <Image
          // src={user?.photoUrl || USER_NOT_FOUND_IMG}
          src="/images/user-img.jpg"
          alt={user?.name || "Usuário não encontrado"}
          width={36}
          height={36}
          className="rounded-full object-cover"
        />

        <div className="absolute duration-200 origin-top-right scale-0 group-hover:scale-100 top-4 right-4 rounded bg-light-surface-5 w-44 shadow-xl">
          <button
            type="button"
            className="p-4 text-light-on-surface w-full text-left bg-light-surface-5 hover:brightness-90 rounded"
            onClick={() => {
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

              replace("/");
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
