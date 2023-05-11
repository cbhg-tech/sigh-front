"use client";

import { IconButton } from "@/components/Inputs/IconButton";
import { useMutation } from "@/hooks/useMutation";
import { UserComplete } from "@/types/UserComplete";
import { PartnerProject, USER_TYPE } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { CgSpinner } from "react-icons/cg";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEye } from "react-icons/ai";

export function ListItemAction({
  id,
  currentUser,
  pp,
}: {
  id: number;
  currentUser: UserComplete;
  pp: PartnerProject;
}) {
  const { mutate, status } = useMutation(`/api/user/${id}`, "DELETE");

  const router = useRouter();

  const canDeleteOrEdit = () => {
    if (currentUser?.type === USER_TYPE.ATHLETE) return false;

    if (
      currentUser?.type === USER_TYPE.ADMIN &&
      !pp.teamId &&
      currentUser.admin?.federationId === pp.federationId
    ) {
      return true;
    }

    if (
      currentUser?.type === USER_TYPE.ADMIN &&
      !pp.federationId &&
      currentUser.admin?.teamId === pp.teamId
    ) {
      return true;
    }

    if (
      currentUser?.type === USER_TYPE.ADMIN &&
      !currentUser.admin?.federationId &&
      !currentUser.admin?.teamId &&
      !pp.federationId &&
      !pp.teamId
    ) {
      return true;
    }

    return false;
  };

  if (status === "loading")
    return (
      <div className="flex gap-2 justify-end">
        <CgSpinner size="2rem" className="text-light-primary animate-spin" />
      </div>
    );

  return (
    <div className="flex gap-2 justify-end items-center">
      {canDeleteOrEdit() ? (
        <>
          <Link href={`/app/projetos-parceiros/formulario?id=${id}`}>
            <IconButton
              icon={MdEdit}
              className="text-light-primary"
              size="1.5rem"
            />
          </Link>
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
        </>
      ) : (
        <>
          <IconButton
            icon={AiOutlineEye}
            className="text-light-tertiary"
            size="1.5rem"
            onClick={() => {
              console.log("details page");
            }}
          />
        </>
      )}
    </div>
  );
}
