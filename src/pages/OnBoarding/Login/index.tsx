import { Form } from '@unform/web';
import { Link, useNavigate } from 'react-router-dom';
import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Textfield } from '../../../components/Inputs/Textfield';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Faça o login no SIGH ou registre-se
        </p>
        <Form onSubmit={data => console.log(data)}>
          <Textfield type="email" name="email" label="Email" />
          <Textfield type="password" name="password" label="Senha" />
          <Button type="submit" label="Entrar" />
        </Form>
        <Button
          type="button"
          label="Ainda não tem cadastro?"
          variant="primary-border"
          onClick={() => navigate('/cadastro')}
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
