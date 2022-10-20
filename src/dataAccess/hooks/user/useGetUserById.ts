import { useQuery } from '@tanstack/react-query';
import { IUser } from '../../../types/User';
import { UserController } from '../../controllers/user.controller';

const userController = new UserController();

export function useGetUserById(id?: string) {
  async function get(): Promise<IUser> {
    return userController.getById(id!);
  }

  return useQuery(['getCurrentUser', id], () => get(), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
