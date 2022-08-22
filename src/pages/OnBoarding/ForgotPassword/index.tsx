import { Form } from '@unform/web';
import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Textfield } from '../../../components/Inputs/Textfield';

export function ForgotPasswordPage() {
  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Informe seu email para recuperar a senha
        </p>
        {/* eslint-disable-next-line no-console */}
        <Form onSubmit={data => console.log(data)}>
          <Textfield type="email" name="email" label="Email" />
          <Button type="submit" label="Recuperar" />
        </Form>
      </div>
    </OnBoardingContainer>
  );
}
