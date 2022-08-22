import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useForgotPassword } from '../../../dataAccess/hooks/password/useForgotPassword';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';

interface IForm {
  email: string;
}

export function ForgotPasswordPage() {
  const formRef = useRef<FormHandles>(null);
  const { mutateAsync, isLoading } = useForgotPassword();

  async function handleSubmit(data: IForm) {
    try {
      await validateForm(data, {
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
      });

      await mutateAsync(data.email);

      toast.success(
        'Um email foi enviado com as instruções para recuperar a senha!',
      );
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Email não encontrado!');
    }
  }

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Informe seu email para recuperar a senha
        </p>
        <Form ref={formRef} onSubmit={data => handleSubmit(data)}>
          <Textfield type="email" name="email" label="Email" />
          <Button type="submit" label="Recuperar" isLoading={isLoading} />
        </Form>
      </div>
    </OnBoardingContainer>
  );
}
