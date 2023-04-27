import { UserComplete } from "@/types/UserComplete";
import { ROLE, USER_TYPE } from "@prisma/client";

interface VerifyUserRoleProps {
  user: UserComplete;
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
