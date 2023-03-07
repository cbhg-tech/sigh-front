"use client";

import { IconButton } from "@/components/Inputs/IconButton";
import Link from "next/link";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

export function ListItemAction({ id }: { id: number }) {
  return (
    <div className="flex gap-2 justify-end">
      <Link href={`/app/usuarios/formulario?id=${id}`}>
        <IconButton
          icon={MdEdit}
          className="text-light-primary"
          size="1.5rem"
        />
      </Link>

      <IconButton
        icon={MdOutlineDeleteOutline}
        onClick={() => console.log(`delete: ${id}`)}
        className="text-light-error"
        size="1.5rem"
      />
    </div>
  );
}
