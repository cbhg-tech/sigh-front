import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Textfield } from '../../../components/Inputs/Textfield';
import { Select } from '../../../components/Inputs/Select';
import { FileInput } from '../../../components/Inputs/FileInput';
import { validateForm } from '../../../utils/validateForm';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { useCreateTechnicalComittee } from '../../../dataAccess/hooks/technicalComittee/useCreateTechnicalComittee';
import { useGlobal } from '../../../contexts/global.context';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { Roles } from '../../../enums/Roles';
import { Button } from '../../../components/Inputs/Button';
import { useGetOneTechnicalComittee } from '../../../dataAccess/hooks/technicalComittee/useGetOneTechnicalComittee';
import { useUpdateTechnicalComittee } from '../../../dataAccess/hooks/technicalComittee/useUpdateTechnicalComittee';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';

interface IForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
}

interface IProps {
  isDisplayMode?: boolean;
}

const Charges = [
  'Treinador',
  'Assistente Técnico',
  'Fisioterapeuta',
  'Chefe de Equipe',
  'Auxiliar de Chefe de Equipe',
  'Médico',
];

export function TechnicalCommitteeRegisterPage({ isDisplayMode }: IProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef<FormHandles>(null);

  const { user } = useGlobal();
  const { mutateAsync: createAsync, isLoading: createLoading } =
    useCreateTechnicalComittee();
  const { mutateAsync: updateAsync, isLoading: updateLoading } =
    useUpdateTechnicalComittee();
  const {
    data: technicalComitteeData,
    isLoading: isLoadingData,
    isSuccess,
  } = useGetOneTechnicalComittee(id);
  const isTeamManager = useHasPermission([Roles.ADMINCLUBE]);

  const [document, setDocument] = useState<File | null>(null);

  async function handleSubmit(data: IForm) {
    if (isDisplayMode) return;

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        phone: Yup.string().required('Celular obrigatório'),
        birthDate: Yup.date().required('Data de nascimento obrigatória'),
        gender: Yup.string().required('Gênero obrigatório'),
        email: Yup.string().required('Email obrigatório'),
        charge: Yup.string().required('Cargo obrigatório'),
        address: Yup.string().required('Endereço obrigatório'),
      });

      if (!id) {
        if (!document) {
          toast.error('É necessário enviar o documento de identificação');
          return;
        }

        await createAsync({
          ...data,
          relatedId: user!.relatedId,
          documentFile: document,
        });

        toast.success('Comissão técnica criada com sucesso');
      } else {
        await updateAsync({
          ...data,
          id,
          relatedId: technicalComitteeData!.relatedId,
          documentFile: document || technicalComitteeData!.documentFile,
        });

        toast.success('Comissão técnica atualizada com sucesso');
      }

      navigate('/app/tecnico/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Não foi possivel salvar dados!');
    }
  }

  if (!isTeamManager && !isDisplayMode) {
    toast.warning('Você não tem permissão para acessar essa página');
    navigate('/app/tecnico/listagem');
  }

  if (isDisplayMode && isLoadingData)
    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        <h2 className="text-3xl text-light-on-surface mb-4">Carregando...</h2>
      </div>
    );

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">Comissão Técnica</h2>
      <Form
        ref={formRef}
        onSubmit={data => handleSubmit(data)}
        className="flex flex-col"
        initialData={isSuccess ? technicalComitteeData : undefined}
      >
        <div className="flex-1">
          <Textfield name="name" label="Nome" disabled={isDisplayMode} />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield name="phone" label="Telefone" disabled={isDisplayMode} />
          </div>
          <div className="col-span-1">
            <Textfield
              type="date"
              name="birthDate"
              label="Data de nascimento"
              disabled={isDisplayMode}
            />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield
              type="email"
              name="email"
              label="Email"
              disabled={isDisplayMode}
            />
          </div>
          <div className="col-span-1">
            <Select name="gender" label="Sexo*" disabled={isDisplayMode}>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </Select>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              name="document"
              label="Número do documento"
              disabled={isDisplayMode}
            />
          </div>
          <div>
            <Select name="charge" label="Cargo" disabled={isDisplayMode}>
              <option value="">Selecione um cargo</option>
              {Charges.map(val => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <MultineTextfield
            name="address"
            label="Endereço"
            disabled={isDisplayMode}
          />
        </div>
        <div className="p-4">
          <FileInput
            name="document"
            label="Documento de identificação (RG ou CNH)"
            hint="Obrigatório para todos"
            onChange={e => setDocument(e.target.files?.[0] || null)}
            disabled={isDisplayMode}
            url={technicalComitteeData?.documentFile || ''}
          />
        </div>
        {!isDisplayMode && (
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
        )}
      </Form>
    </div>
  );
}
