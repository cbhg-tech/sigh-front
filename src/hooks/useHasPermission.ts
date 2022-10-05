import { auth } from '../app/FirebaseConfig';
import { useGetCurrentUser } from '../dataAccess/hooks/user/useGetCurrentUser';
import { Roles } from '../enums/Roles';

export function useHasPermission(arr: Array<Roles>) {
  const { currentUser } = auth;
  const { data } = useGetCurrentUser(true);

  if (currentUser && data) {
    return arr.includes(data.role as Roles);
  }

  return false;
}
