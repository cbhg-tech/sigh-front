import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserController } from '../../controllers/user.controller';

const userController = new UserController();

export function useDisableUser() {
  const queryClient = useQueryClient();

  async function disableUser(id: string): Promise<void> {
    await userController.disable(id);
    queryClient.invalidateQueries(['getUsers']);
  }

  return useMutation(disableUser);
}
