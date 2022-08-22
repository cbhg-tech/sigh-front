import { useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useAuthenticate } from '../../../dataAccess/hooks/auth/useAuthenticate';
import { validateForm } from '../../../utils/validateForm';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { useGlobal } from '../../../contexts/global.context';

interface IForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { setIsLoggedIn } = useGlobal();
  const { mutateAsync, isLoading } = useAuthenticate();

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    try {
      await validateForm(data, {
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await mutateAsync({
        email: data.email,
        password: data.password,
      });

      setIsLoggedIn(true);

      toast.success('Login realizado com sucesso!');

      navigate('/app/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      if (err.message === 'Usuário inativo') {
        return toast.error('Usuário inativo');
      }

      toast.error('Ops! Email e senha não batem!');
    }
  }

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Faça o login no SIGH ou registre-se
        </p>
        <Form ref={formRef} onSubmit={data => handleSubmit(data)}>
          <Textfield type="email" name="email" label="Email" />
          <Textfield type="password" name="password" label="Senha" />
          <Button type="submit" label="Entrar" isLoading={isLoading} />
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
