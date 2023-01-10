import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { Textfield } from '../../../components/Inputs/Textfield';
import { Select } from '../../../components/Inputs/Select';
import { FileInput } from '../../../components/Inputs/FileInput';
import { Button } from '../../../components/Inputs/Button';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { IForm, useCreateTechnicalOfficer } from '../useCreateTechnicalOfficer';

interface IProps {
  isDisplayMode?: boolean;
}

export function TechnicalOfficerRegisterPage({ isDisplayMode }: IProps) {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { mutateAsync, data, mutationStatus, queryStatus, queryLoading } =
    useCreateTechnicalOfficer({ isDisplayMode });

  const [document, setDocument] = useState<File | undefined>();

  async function submit(data: IForm) {
    try {
      mutateAsync({ ...data, document });
    } catch (err) {
      // @ts-ignore
      formRef.current?.setErrors(err);
    }
  }

  const mutationLoading = mutationStatus === 'loading';

  if (isDisplayMode && queryLoading)
    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        <h2 className="text-3xl text-light-on-surface mb-4">Carregando...</h2>
      </div>
    );

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">Oficial Técnico</h2>
      <Form
        ref={formRef}
        onSubmit={data => submit(data)}
        className="flex flex-col"
        initialData={queryStatus === 'success' ? data! : undefined}
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
            <Textfield name="charge" label="Cargo" disabled={isDisplayMode} />
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
            onChange={e => setDocument(e.target.files?.[0] || undefined)}
            disabled={isDisplayMode}
            url={data?.documentFile || ''}
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
              isLoading={mutationLoading}
              disabled={mutationLoading}
            />
          </div>
        )}
      </Form>
    </div>
  );
}
