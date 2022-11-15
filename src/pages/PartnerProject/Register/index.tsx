import { useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useNavigate, useParams } from 'react-router-dom';

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
import { useUpdatePartnerProject } from '../../../dataAccess/hooks/partnerProject/useUpdatePartnerProject';
import { useGetOnePartnerProject } from '../../../dataAccess/hooks/partnerProject/useGetOnePartnerProject';
import { Select } from '../../../components/Inputs/Select';
import { States } from '../../../dataAccess/static/states';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';

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
  description: string;
  address: {
    city: string;
    state: string;
    place: string;
  };
}

export function PartnerProjectRegisterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();
  const { mutateAsync: createAsync, isLoading: createLoading } =
    useCreateProjectPartner();
  const { mutateAsync: updateASync, isLoading: updateLoading } =
    useUpdatePartnerProject();
  const { data: partnerProjectData } = useGetOnePartnerProject(id);

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
        description: Yup.string().required('Descrição é obrigatório'),
        contact: Yup.object({
          name: Yup.string().required('Nome de contato obrigatória'),
          phone: Yup.string().required('Numero de contato obrigatório'),
        }),
        address: Yup.object({
          city: Yup.string().required('Cidade é obrigatória'),
          state: Yup.string().required('Estado é obrigatório'),
          place: Yup.string().required('Local das atividades é obrigatório'),
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

      if (!id) {
        await createAsync({
          ...data,
          relatedId: user!.relatedId,
          relatedType,
        });

        toast.success('Projeto cadastrado com sucesso');
      } else {
        await updateASync({
          ...data,
          id,
          relatedId: partnerProjectData!.relatedId,
          relatedType,
        });

        toast.success('Projeto atualizado com sucesso');
      }

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
        initialData={partnerProjectData}
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

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div>
            <Select label="Estado" name="address.state">
              {States.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Textfield label="Cidade" name="address.city" />
          </div>
          <div>
            <Textfield label="Local das atividades" name="address.place" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1">
          <div>
            <MultineTextfield label="Detalhes do projeto" name="description" />
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
            isLoading={createLoading || updateLoading}
            disabled={createLoading || updateLoading}
          />
        </div>
      </Form>
    </div>
  );
}
