import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { OnBoardingContainer } from '..';
import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useCreateAthlete } from '../../../dataAccess/hooks/athlete/useCreateAthlete';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { maskCPF, validateCPF } from '../../../utils/cpfInputMask';

interface IForm {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  team: string;
  document: string;
}

export function RegisterPage() {
  const today = dayjs().format('YYYY-MM-DD');

  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const { data: publicTeams } = useGetPublicTeams();
  const { mutateAsync, isLoading } = useCreateAthlete();

  async function handleSubmit(data: IForm) {
    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .email('Email inválido')
          .required('Email obrigatório'),
        document: Yup.string()
          .required('Documento obrigatório')
          .test('validate-cpf', 'CPF inválido', val => validateCPF(val)),
        password: Yup.string().required('Senha obrigatória'),
        birthDate: Yup.string(),
        team: Yup.string().required('Clube obrigatório'),
      });

      const team = publicTeams?.list.find(t => t.id === data.team);

      const birthDate = dayjs(data.birthDate).format('YYYY-MM-DD');

      await mutateAsync({
        ...data,
        birthDate,
        relatedName: team!.name,
        relatedId: team!.id,
        relatedType: 'team',
      });

      toast.success('Cadastro realizado com sucesso!');

      navigate('/app/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      toast.error(err.message || 'Ops! Houve um erro ao criar o usuário!');
    }
  }

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Cadastro de atletas do hóquei brasileiro
        </p>
        <Form onSubmit={data => handleSubmit(data)} ref={formRef}>
          <Textfield type="text" name="name" label="Nome completo" />
          <Textfield type="email" name="email" label="Email" />
          <Textfield type="text" name="document" label="CPF" mask={maskCPF} />
          <Textfield
            type="date"
            name="birthDate"
            label="Data de nascimento"
            max={today}
          />
          <Select name="team" label="Clube atual">
            <option value="">Selecione um clube</option>
            {publicTeams &&
              publicTeams.list.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </Select>
          <Textfield type="password" name="password" label="Senha" />
          <Button type="submit" label="Criar conta" isLoading={isLoading} />
        </Form>
        <p className="text-xs text-light-on-surface text-center">
          * Caso ainda não tenha um clube e deseja conhecer e praticar este
          esporte, acesse nosso site e saiba como jogar hóquei no Brasil. Saiba
          mais!
        </p>
      </div>
    </OnBoardingContainer>
  );
}
