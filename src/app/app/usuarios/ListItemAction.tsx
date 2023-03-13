"use client";

import { IconButton } from "@/components/Inputs/IconButton";
import { useMutation } from "@/hooks/useMutation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

export function ListItemAction({ id, userId }: { id: number; userId: number }) {
  const { mutate, status } = useMutation(`/api/user/${id}`, "DELETE");

  const router = useRouter();

  if (status === "loading")
    return (
      <div className="flex gap-2 justify-end">
        <CgSpinner size="2rem" className="text-light-primary animate-spin" />
      </div>
    );

  return (
    <div className="flex gap-2 justify-end">
      <Link href={`/app/usuarios/formulario?id=${id}`}>
        <IconButton
          icon={MdEdit}
          className="text-light-primary"
          size="1.5rem"
        />
      </Link>

      {userId !== id && (
        <IconButton
          icon={MdOutlineDeleteOutline}
          onClick={async () => {
            await mutate();

            startTransition(() => {
              router.refresh();
            });
          }}
          className="text-light-error"
          size="1.5rem"
        />
      )}
    </div>
  );
}
