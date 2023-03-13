import { ROLE, User, USER_TYPE, Admin, Athlete } from "@prisma/client";

interface VerifyUserRoleProps {
  user: User & {
    admin?: Admin | null;
    athlete?: Athlete | null;
  };
  isAthlete?: boolean;
  roles?: ROLE[];
}

export const verifyUserRole = ({
  isAthlete,
  roles,
  user,
}: VerifyUserRoleProps) => {
  if (isAthlete && user.type === USER_TYPE.ATHLETE) {
    return true;
  }

  if (!isAthlete && user.type === USER_TYPE.ADMIN && roles) {
    return roles.includes(user.admin?.role as ROLE);
  }

  return false;
};
