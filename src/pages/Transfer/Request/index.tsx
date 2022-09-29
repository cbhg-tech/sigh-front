import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../components/Inputs/Button';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGlobal } from '../../../contexts/global.context';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useCreateTransferRequest } from '../../../dataAccess/hooks/transfer/useCreateTransferRequest';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';

interface IForm {
  transferData: Date;
  obs: string;
  destinationClub: string;
}

export function TransferRequestPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();
  const { mutateAsync } = useCreateTransferRequest();
  const { data: publicTeams, isLoading } = useGetPublicTeams();

  const handeSubmit = async (data: IForm) => {
    if (!user) return;

    try {
      await validateForm(data, {
        transferData: Yup.string().required('Campo obrigatório'),
        obs: Yup.string(),
        destinationClub: Yup.string().required('Clube de destino obrigatório'),
      });

      const team = publicTeams?.list.find(t => t.id === data.destinationClub);

      if (team?.id === user.team?.id) {
        throw new Error('Você não pode transferir para o mesmo clube');
      }

      await mutateAsync({
        user: {
          id: user.id,
          name: user.name,
        },
        destinationTeam: team!.name,
        destinationTeamId: team!.id,
        currentTeam: user.team!.name,
        currentTeamId: user.team!.id,
        obs: data.obs,
        transferData: dayjs(data.transferData).toString(),
      });

      toast.success('Solicitação enviada com sucesso!');

      navigate('/app/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      toast.error(err.message || 'Ops! Houve um erro ao criar a federação!');
    }
  };

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h1 className="text-3xl text-light-on-surface mb-2">
        Solicitação de Transferência
      </h1>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> É obrigatório preencher todos os dados abaixo.
      </p>
      <Form ref={formRef} onSubmit={data => handeSubmit(data)}>
        <Textfield
          type="date"
          label="Data real da transferência"
          name="transferData"
          min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
        />
        <Select name="destinationClub" label="Clube de destino">
          <option value="">Selecione um clube</option>
          {publicTeams &&
            publicTeams.list.map(team => (
              <option value={team.id}>{team.name}</option>
            ))}
        </Select>
        <MultineTextfield name="obs" label="Observações" />

        <div className="col-span-6 lg:col-span-12 mt-4">
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              aditionalClasses="w-auto px-2 text-light-on-surface-variant"
              label="Cancelar"
              variant="primary-border"
            />
            <Button
              type="submit"
              aditionalClasses="w-auto px-2"
              label="Fazer requisição"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
