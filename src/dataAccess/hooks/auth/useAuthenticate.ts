import { useMutation } from '@tanstack/react-query';
import { AuthController, IAuthData } from '../../controllers/auth.controller';

const authController = new AuthController();

async function authenticate(data: IAuthData): Promise<void> {
  return authController.authenticate(data);
}

export function useAuthenticate() {
  return useMutation(authenticate);
}
