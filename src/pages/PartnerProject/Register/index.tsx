import { useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Textfield } from '../../../components/Inputs/Textfield';
import { Button } from '../../../components/Inputs/Button';
import { validateForm } from '../../../utils/validateForm';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { useCreateProjectPartner } from '../../../dataAccess/hooks/partnerProject/useCreatePartnerProject';
import { useGlobal } from '../../../contexts/global.context';
import { Roles } from '../../../enums/Roles';
import { DateService } from '../../../services/DateService';

interface IForm {
  name: string;
  initialDate: string;
  finalDate: string;
  contact: {
    name: string;
    phone: string;
  };
  practitioners: number;
  malePractitioners: number;
  femalePractitioners: number;
  ageGroup: string;
}

export function PartnerProjectRegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();
  const { mutateAsync, isLoading } = useCreateProjectPartner();

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        initialDate: Yup.string().required('Data de início obrigatório'),
        finalDate: Yup.date().required('Data final obrigatória'),
        practitioners: Yup.number().required('Praticantes obrigatório'),
        malePractitioners: Yup.number().required(
          'Praticantes masculinos obrigatório',
        ),
        femalePractitioners: Yup.number().required(
          'Praticantes femininos obrigatório',
        ),
        ageGroup: Yup.string().required('Faixa etária obrigatório'),
        contact: Yup.object({
          name: Yup.string().required('Nome de contato obrigatória'),
          phone: Yup.string().required('Numero de contato obrigatório'),
        }),
      });

      if (!DateService().isAfter(data.initialDate, data.finalDate)) {
        toast.error('Data final deve ser maior que a data inicial');
        return;
      }

      let relatedType: 'Team' | 'Federation' | 'Cofederation';

      switch (user?.role) {
        case Roles.ADMIN:
          relatedType = 'Cofederation';
          break;
        case Roles.ADMINFEDERACAO:
          relatedType = 'Federation';
          break;
        case Roles.ADMINCLUBE:
        default:
          relatedType = 'Team';
          break;
      }

      await mutateAsync({ ...data, relatedId: user!.relatedId, relatedType });

      toast.success('Projeto cadastrado com sucesso');

      navigate('/app/projetosparceiros/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Não foi possivel salvar dados!');
    }
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">
        Cadastro de projeto de parceria
      </h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> O projeto criado ficará vinculado a
        instituição da conta do usuário, ou seja, ou ao Clube, ou a uma
        Federação ou a Confederação.
      </p>
      <Form
        ref={formRef}
        onSubmit={data => handleSubmit(data)}
        className="flex flex-col gap-2"
      >
        <div className="flex-1">
          <Textfield label="Nome do projeto" name="name" />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield label="Nome do contato" name="contact.name" />
          </div>
          <div>
            <Textfield label="Telefone de contato" name="contact.phone" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield type="date" label="Data de início" name="initialDate" />
          </div>
          <div>
            <Textfield type="date" label="Data do fim" name="finalDate" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Percentual masculino"
              name="malePractitioners"
            />
          </div>
          <div>
            <Textfield
              type="number"
              label="Percentual feminino"
              name="femalePractitioners"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Total de participantes"
              name="practitioners"
            />
          </div>
          <div>
            <Textfield
              label="Faixa Etária"
              hint="Exemplo: Entre 10 e 15 anos"
              name="ageGroup"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
            type="button"
            onClick={() => navigate('/app/tecnico/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            label="Salvar"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </Form>
    </div>
  );
}
