import { useQuery } from 'react-query';
import { IUser } from '../../../types/User';
import { UserController } from '../../controllers/user.controller';

const userController = new UserController();

async function getUsers(): Promise<IUser[]> {
  return userController.list();
}

export function useGetUsers() {
  return useQuery(['getUsers'], () => getUsers(), {
    refetchOnWindowFocus: false,
  });
}
