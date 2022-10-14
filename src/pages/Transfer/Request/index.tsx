import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../components/Inputs/Button';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGlobal } from '../../../contexts/global.context';
import { useGetCurrentConfigs } from '../../../dataAccess/hooks/configs/useGetConfigs';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useCreateTransferRequest } from '../../../dataAccess/hooks/transfer/useCreateTransferRequest';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { DataService } from '../../../utils/DataService';
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
  const { data, isLoading: isLoadingConfigs } = useGetCurrentConfigs();

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

      if (team?.id === user.related?.id) {
        throw new Error('Você não pode transferir para o mesmo clube');
      }

      await mutateAsync({
        userId: user.id,
        currentTeamId: user.related!.id,
        destinationTeamId: team!.id,
        currentFederationId: user.related!.id,
        destinationFederationId: team!.federationId!,
        obs: data.obs,
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

  if (!isLoadingConfigs && data) {
    const { nextTransferPeriod, transferPeriodBegin, transferPeriodEnd } = data;

    const isTransferPeriod = DataService().isBetween(
      transferPeriodBegin.seconds,
      transferPeriodEnd.seconds,
    );

    const transferPeriodEnds = DataService().format(transferPeriodEnd.seconds);

    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        {!isTransferPeriod && (
          <>
            <h2 className="text-3xl text-light-on-surface mb-2">
              Solicitação de Transferência
            </h2>
            <p>
              O próximo período de transferência começa no dia{' '}
              {DataService().format(nextTransferPeriod.seconds)}{' '}
            </p>
          </>
        )}

        {isTransferPeriod && (
          <>
            <h2 className="text-3xl text-light-on-surface mb-2">
              Solicitação de Transferência
            </h2>
            <p className="text-light-on-surface-variant">
              <strong>Atenção!</strong> É obrigatório preencher todos os dados
              abaixo.
            </p>
            <p className="mb-8 text-light-on-surface-variant">
              O período de transferência termina no dia{' '}
              <strong>{transferPeriodEnds}</strong>
            </p>
            <Form ref={formRef} onSubmit={data => handeSubmit(data)}>
              <Textfield
                type="date"
                label="Data real da solicitação de transferência"
                name="transferData"
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
          </>
        )}
      </div>
    );
  }

  if (!isLoadingConfigs && !data) {
    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        <h2 className="text-center mt-8 text-light-on-surface-variant">
          Dados do período de transferência não encontrados
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-center mt-8 text-light-on-surface-variant">
        Carregando periodo de transferência
      </h2>
    </div>
  );
}
