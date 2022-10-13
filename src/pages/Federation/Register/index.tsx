import { useRef, useState } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';
import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { States } from '../../../dataAccess/static/states';
import { validateForm } from '../../../utils/validateForm';
import { useCreateFederation } from '../../../dataAccess/hooks/federation/useCreateFederation';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { FileInput } from '../../../components/Inputs/FIleInput';

interface IForm {
  name: string;
  email: string;
  initials: string;
  uf: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
}

interface IFiles {
  logo: File | undefined;
  presidentDocument: File | undefined;
  federationDocument: File | undefined;
  electionMinutes: File | undefined;
}

export function FederationRegisterPage() {
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const { mutateAsync, isLoading } = useCreateFederation();

  const [files, setFiles] = useState<IFiles>({
    logo: undefined,
    presidentDocument: undefined,
    federationDocument: undefined,
    electionMinutes: undefined,
  });
  const [error, setError] = useState('');

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    const { electionMinutes, federationDocument, logo, presidentDocument } =
      files;

    if (
      !electionMinutes ||
      !federationDocument ||
      !logo ||
      !presidentDocument
    ) {
      return setError('Faça upload de todos os arquivos');
    }

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        initials: Yup.string().required('Sigla obrigatória'),
        uf: Yup.string().required('Estado obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        presidentName: Yup.string().required('Nome do presidente obrigatória'),
        beginningOfTerm: Yup.string().required('Início do mandato obrigatória'),
        endOfTerm: Yup.string().required('Fim do mandato obrigatória'),
      });

      await mutateAsync({
        ...data,
        logo,
        electionMinutes,
        presidentDocument,
        federationDocument,
      });

      toast.success('Federação criada com sucesso!');

      navigate('/app/federacoes/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Houve um erro ao criar a federação!');
    }
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> após este cadastro, faça o registro de pelo
        menos um usuário administrador para esta federação.
      </p>
      <Form
        ref={formRef}
        className="grid grid-cols-1 md:grid-cols-6 gap-2"
        onSubmit={data => handleSubmit(data)}
      >
        <div className="col-span-1 md:col-span-4">
          <Textfield name="name" label="Nome" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Textfield name="initials" label="Sigla" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Select name="uf" label="Estado">
            {States.map(state => (
              <option value={state}>{state}</option>
            ))}
          </Select>
        </div>
        <div className="col-span-1 md:col-span-4">
          <Textfield type="email" name="email" label="Email" />
        </div>
        <div className="col-span-1 md:col-span-6 mb-2 md:flex md:justify-between">
          <FileInput
            name="logo-file"
            label="Logo da federação"
            onChange={e => setFiles({ ...files, logo: e.target.files?.[0] })}
            accept="image/png, image/jpeg, image/jpg"
          />
          <FileInput
            name="federation-file"
            label="Anexo Estatuto da Entidade"
            onChange={e =>
              setFiles({ ...files, federationDocument: e.target.files?.[0] })
            }
          />
        </div>
        <div className="col-span-1 md:col-span-6">
          <Textfield name="presidentName" label="Nome do presidente" />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield
            type="date"
            name="beginningOfTerm"
            label="Data de início do mandato"
          />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield
            type="date"
            name="endOfTerm"
            label="Data do fim do mandato"
          />
        </div>
        <div className="col-span-1 md:col-span-6 mb-2 md:flex md:justify-between">
          <FileInput
            name="president-file"
            label="Anexo RG do Presidente"
            onChange={e =>
              setFiles({ ...files, presidentDocument: e.target.files?.[0] })
            }
          />
          <FileInput
            name="election-file"
            label="Anexo Ata da Eleição"
            onChange={e =>
              setFiles({ ...files, electionMinutes: e.target.files?.[0] })
            }
          />
        </div>
        {error && (
          <div className="col-span-1 md:col-span-6 bg-light-error-container text-light-on-error-container rounded-md p-4 flex items-center gap-2">
            <MdError size="1.5rem" />
            <p>{error}</p>
          </div>
        )}
        <div className="col-span-1 md:col-span-6 flex gap-2 justify-end">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            variant="primary-border"
            type="submit"
            label="Cancelar"
            onClick={() => navigate('/app/federacoes/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            label="Criar federação"
            isLoading={isLoading}
            disabled={isLoading}
          />
        </div>
      </Form>
    </div>
  );
}
