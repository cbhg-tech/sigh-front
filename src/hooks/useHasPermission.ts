import { auth } from '../app/FirebaseConfig';
import { useGlobal } from '../contexts/global.context';
import { Roles } from '../enums/Roles';

export function useHasPermission(arr: Array<Roles>) {
  const { currentUser } = auth;
  const { user } = useGlobal();

  if (currentUser && user) {
    return arr.includes(user.role as Roles);
  }

  return false;
}
