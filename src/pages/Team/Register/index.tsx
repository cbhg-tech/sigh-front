import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { MdError } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../components/Inputs/Button';
import { FileInput } from '../../../components/Inputs/FIleInput';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGetFederations } from '../../../dataAccess/hooks/federation/useGetFederations';
import { useCreateTeam } from '../../../dataAccess/hooks/team/useCreateTeam';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';
import { useGetOneTeam } from '../../../dataAccess/hooks/team/useGetOneTeam';
import { useUpdateTeam } from '../../../dataAccess/hooks/team/useUpdateTeam';

interface IForm {
  name: string;
  email: string;
  initials: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federation: string;
  url: string;
}

interface IFiles {
  logo: File | undefined;
  presidentDocument: File | undefined;
  teamDocument: File | undefined;
  electionMinutes: File | undefined;
}

export function TeamRegisterPage() {
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: federationData } = useGetFederations();
  const { data: teamData } = useGetOneTeam(id);
  const { mutateAsync: createTeamAsync, isLoading: createTeamLoading } =
    useCreateTeam();
  const { mutateAsync: updateTeamAsync, isLoading: updateTeamLoading } =
    useUpdateTeam();

  const [files, setFiles] = useState<IFiles>({
    logo: undefined,
    presidentDocument: undefined,
    teamDocument: undefined,
    electionMinutes: undefined,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (teamData) {
      formRef.current?.setFieldValue('federation', teamData.federationId);
    }
  }, [teamData]);

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    const { electionMinutes, teamDocument, logo, presidentDocument } = files;

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        coachName: Yup.string().required('Nome do técnico obrigatório'),
        description: Yup.string().required('Descrição obrigatório'),
        federation: Yup.string().required('Federação obrigatório'),
        initials: Yup.string().required('Sigla obrigatória'),
        url: Yup.string().required('Site ou fanpage obrigatória'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        presidentName: Yup.string().required('Nome do presidente obrigatória'),
        beginningOfTerm: Yup.string().required('Início do mandato obrigatória'),
        endOfTerm: Yup.string().required('Fim do mandato obrigatória'),
      });

      if (!id) {
        if (!electionMinutes || !teamDocument || !logo || !presidentDocument) {
          return setError('Faça upload de todos os arquivos');
        }

        await createTeamAsync({
          ...data,
          federationId: data.federation,
          logo,
          electionMinutes,
          presidentDocument,
          teamDocument,
        });

        toast.success('Clube criado com sucesso!');
      } else {
        await updateTeamAsync({
          ...data,
          id,
          federationId: data.federation,
          logo: logo || teamData!.logo,
          electionMinutes: electionMinutes || teamData!.electionMinutes,
          presidentDocument: presidentDocument || teamData!.presidentDocument,
          teamDocument: teamDocument || teamData!.teamDocument,
        });

        toast.success('Clube atualizado com sucesso!');
      }

      navigate('/app/clubes/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Houve um erro ao criar ou editar Clube!');
    }
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <Form
        ref={formRef}
        className="grid grid-cols-1 md:grid-cols-6 gap-2"
        onSubmit={data => handleSubmit(data)}
        initialData={teamData}
      >
        <div className="col-span-1 md:col-span-4">
          <Textfield name="name" label="Nome" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <Textfield name="initials" label="Sigla" />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield type="email" name="email" label="Email" />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield name="url" label="Site/Fanpage" />
        </div>
        <div className="col-span-1 md:col-span-6">
          <Textfield name="presidentName" label="Nome do Presidente" />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield
            type="date"
            name="beginningOfTerm"
            label="Início do mandato"
          />
        </div>
        <div className="col-span-1 md:col-span-3">
          <Textfield type="date" name="endOfTerm" label="Fim do mandato" />
        </div>
        <div className="col-span-1 md:col-span-6">
          <Textfield name="coachName" label="Nome do Técnico" />
        </div>
        <div className="col-span-1 md:col-span-6">
          <MultineTextfield name="description" label="Desccrição" />
        </div>
        <div className="col-span-1 md:col-span-6">
          <Select name="federation" label="Federação">
            <option value="">Escolha uma federação</option>
            {federationData?.map(federation => (
              <option key={federation.id} value={federation.id}>
                {federation.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-1 md:col-span-6 mb-2 md:flex md:justify-between">
          <FileInput
            name="logo-file"
            label="Logo do clube"
            onChange={e => setFiles({ ...files, logo: e.target.files?.[0] })}
            accept="image/png, image/jpeg, image/jpg"
          />
          <FileInput
            name="federation-file"
            label="Anexo Estatuto da Entidade"
            onChange={e =>
              setFiles({ ...files, teamDocument: e.target.files?.[0] })
            }
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
            onClick={() => navigate('/app/clubes/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            label="Salvar"
            isLoading={createTeamLoading || updateTeamLoading}
            disabled={createTeamLoading || updateTeamLoading}
          />
        </div>
      </Form>
    </div>
  );
}
