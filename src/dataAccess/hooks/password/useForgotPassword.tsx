import { useMutation } from 'react-query';
import { PasswordController } from '../../controllers/password.controller';

const passwordController = new PasswordController();

async function forgotPassword(email: string): Promise<void> {
  return passwordController.forgot(email);
}

export function useForgotPassword() {
  return useMutation(forgotPassword);
}
