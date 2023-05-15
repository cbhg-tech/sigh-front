import { PermissionDenied } from "@/components/PermissionDenied";
import { NextPage } from "@/types/NextPage";
import { getCurrentUser } from "@/utils/getCurrentUser";
import { verifyUserRole } from "@/utils/verifyUserRole";
import { ROLE } from "@prisma/client";
import { Form } from "./Form";

export interface IForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  charge: string;
  birthDate: string;
  document: string;
}

export default async function TechnicalOfficerForm({ searchParams }: NextPage) {
  const currentUser = await getCurrentUser();
  const id = searchParams?.id as string;

  const canCreate = verifyUserRole({
    user: currentUser!,
    roles: [ROLE.ADMINTEAM],
  });

  if (!canCreate) return <PermissionDenied />;

  return <Form id={id} />;
}
