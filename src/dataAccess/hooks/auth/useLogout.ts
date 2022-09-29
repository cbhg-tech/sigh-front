import { useMutation } from '@tanstack/react-query';
import { AuthController } from '../../controllers/auth.controller';

const authController = new AuthController();

export function useLogout() {
  async function logout(): Promise<void> {
    authController.logout();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  return useMutation(logout);
}
