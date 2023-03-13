"use client";

import { IconButton } from "@/components/Inputs/IconButton";
import Link from "next/link";
import { MdEdit, MdRemoveRedEye } from "react-icons/md";

export function ListItemAction({
  id,
  enableEdit,
}: {
  id: number;
  enableEdit: boolean;
}) {
  return (
    <div className="flex gap-2 justify-end">
      <Link href={`/app/federacoes/${id}`}>
        <IconButton
          icon={MdRemoveRedEye}
          className="text-light-tertiary"
          size="1.5rem"
        />
      </Link>
      {enableEdit && (
        <Link href={`/app/federacoes/formulario?id=${id}`}>
          <IconButton
            icon={MdEdit}
            className="text-light-primary"
            size="1.5rem"
          />
        </Link>
      )}
    </div>
  );
}
