import { Form } from '@unform/web';
import { Link } from 'react-router-dom';
import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Textfield } from '../../../components/Inputs/Textfield';

export function LoginPage() {
  return (
    <OnBoardingContainer>
      <div>
        <Form onSubmit={data => console.log(data)}>
          <Textfield type="email" name="email" label="Email" />
          <Textfield type="password" name="password" label="Senha" />
          <Button type="submit" label="Entrar" />
        </Form>
        <Button
          type="button"
          label="Ainda não tem cadastro?"
          variant="primary-border"
          aria-label="Ainda não tem cadastro? Clique aqui"
        />

        <Link
          aria-label="Esqueceu a senha? Clique aqui"
          className="p-2 font-medium text-light-on-surface text-center block"
          to="/esqueceu-a-senha"
        >
          Esqueceu a senha?
        </Link>
      </div>
    </OnBoardingContainer>
  );
}
