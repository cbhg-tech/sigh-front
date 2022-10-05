import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IUser } from '../../../types/User';
import { UserController } from '../../controllers/user.controller';

const userController = new UserController();

export function usePutUser() {
  const queryClient = useQueryClient();

  async function putUser(data: Partial<IUser>): Promise<void> {
    await userController.put(data);
    queryClient.invalidateQueries(['getUsers']);
    queryClient.invalidateQueries(['getCurrentUser']);
  }

  return useMutation(putUser);
}
