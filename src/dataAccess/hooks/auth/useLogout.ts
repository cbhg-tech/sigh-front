import { useMutation } from 'react-query';
import { AuthController } from '../../controllers/auth.controller';

const authController = new AuthController();

async function logout(): Promise<void> {
  return authController.logout();
}

export function useLogout() {
  return useMutation(logout);
}
