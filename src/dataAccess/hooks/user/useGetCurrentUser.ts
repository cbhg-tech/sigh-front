import { useQuery } from 'react-query';
import { IUser } from '../../../types/User';
import { UserController } from '../../controllers/user.controller';

const userController = new UserController();

async function getCurrentUsers(): Promise<IUser> {
  return userController.getCurrent();
}

export function useGetCurrentUser(userLoggedIn: boolean) {
  return useQuery(['getCurrentUser', userLoggedIn], () => getCurrentUsers(), {
    refetchOnWindowFocus: false,
    enabled: userLoggedIn,
  });
}
