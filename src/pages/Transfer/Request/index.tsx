import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import dayjs from 'dayjs';
import { useMutation } from '@tanstack/react-query';
import { Button } from '../../../components/Inputs/Button';
import { MultineTextfield } from '../../../components/Inputs/MultineTextfield';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGlobal } from '../../../contexts/global.context';
import { useGetCurrentConfigs } from '../../../dataAccess/hooks/configs/useGetConfigs';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { DateService } from '../../../services/DateService';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';
import { Status } from '../../../enums/Status';
import { FileInput } from '../../../components/Inputs/FileInput';
import { TransferController } from '../../../dataAccess/controllers/transfer.controller';
import { useTransfer } from '../useTransfer';

interface IForm {
  transferData: string;
  obs: string;
  destinationClub: string;
}

interface IFile {
  federationPaymentVoucher: File | null;
  cbhgPaymentVoucher: File | null;
}

const transferController = new TransferController();

export function TransferRequestPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { data, isLoading: isLoadingConfigs } = useGetCurrentConfigs();
  const { userTransfer, queryUserTransferStatus } = useTransfer({
    fetchAll: false,
    transferId: '',
  });

  const { user } = useGlobal();
  const { data: publicTeams } = useGetPublicTeams();

  const [files, setFiles] = useState<IFile>({
    cbhgPaymentVoucher: null,
    federationPaymentVoucher: null,
  });

  const { mutateAsync: handleSubmit, isLoading: isLoadingSubmit } = useMutation(
    async (data: IForm) => {
      if (!user) return;

      if (!files.cbhgPaymentVoucher)
        return toast.error('Comprovante de pagamento da CBHG é obrigatório');

      if (user.transfering)
        return toast.error(
          'Você já possui uma solicitação de transferência pendente',
        );

      try {
        await validateForm(data, {
          transferData: Yup.string().required('Campo obrigatório'),
          obs: Yup.string(),
          destinationClub: Yup.string().required(
            'Clube de destino obrigatório',
          ),
        });

        const currentTeam = publicTeams?.list.find(
          t => t.id === user.relatedId,
        );
        const team = publicTeams?.list.find(t => t.id === data.destinationClub);

        if (team?.id === user.relatedId) {
          throw new Error('Você não pode transferir para o mesmo clube');
        }

        await transferController.create({
          transferData: data.transferData,
          userId: user.id,
          currentTeamStatus: Status.PENDING,
          currentTeamId: user.relatedId,
          destinationTeamStatus: Status.PENDING,
          destinationTeamId: team!.id,
          currentFederationStatus: Status.PENDING,
          currentFederationId: currentTeam!.federationId!,
          destinationFederationStatus: Status.PENDING,
          destinationFederationId: team!.federationId!,
          obs: data.obs,
          documents: {
            cbhgPaymentVoucher: files.cbhgPaymentVoucher!,
            federationPaymentVoucher: files.federationPaymentVoucher,
          },
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
    },
  );

  useEffect(() => {
    formRef.current?.setData({
      transferData: dayjs(userTransfer?.transferData).format('YYYY-MM-DD'),
      destinationClub: userTransfer?.destinationTeamId,
      obs: userTransfer?.obs,
    });
  }, [userTransfer]);

  if (!isLoadingConfigs && queryUserTransferStatus === 'loading')
    return <p>Carregando...</p>;

  if (!isLoadingConfigs && data) {
    const { nextTransferPeriod, transferPeriodBegin, transferPeriodEnd } = data;

    const isTransferPeriod = DateService().isBetween(
      transferPeriodBegin.seconds,
      transferPeriodEnd.seconds,
    );

    const transferPeriodEnds = DateService().format(transferPeriodEnd.seconds);

    return (
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        {!isTransferPeriod && (
          <>
            <h2 className="text-3xl text-light-on-surface mb-2">
              Solicitação de Transferência
            </h2>
            <p>
              O próximo período de transferência começa no dia{' '}
              {DateService().format(nextTransferPeriod.seconds)}{' '}
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
            <Form ref={formRef} onSubmit={data => handleSubmit(data)}>
              <Textfield
                type="date"
                label="Data real da solicitação de transferência"
                name="transferData"
                value={dayjs().format('YYYY-MM-DD')}
                disabled
              />
              <Select name="destinationClub" label="Clube de destino">
                <option value="">Selecione um clube</option>
                {publicTeams &&
                  publicTeams.list.map(team => (
                    <option value={team.id}>{team.name}</option>
                  ))}
              </Select>
              <MultineTextfield name="obs" label="Observações" />

              <div className="flex flex-col xl:flex-row gap-4 mt-4">
                <div className="w-full">
                  <FileInput
                    name="federationPaymentVoucher"
                    label="Comprovante de pagamento do federação"
                    hint="Opcional"
                    url={userTransfer?.documents.federationPaymentVoucher}
                    onChange={e =>
                      setFiles({
                        ...files,
                        federationPaymentVoucher: e.target.files![0],
                      })
                    }
                  />
                </div>
                <div className="w-full">
                  <FileInput
                    name="cbhgPaymentVoucher"
                    label="Comprovante de pagamento da CBHG"
                    hint="Obrigatório"
                    url={userTransfer?.documents.cbhgPaymentVoucher}
                    onChange={e =>
                      setFiles({
                        ...files,
                        cbhgPaymentVoucher: e.target.files![0],
                      })
                    }
                  />
                </div>
              </div>

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
                    isLoading={isLoadingSubmit}
                    disabled={isLoadingSubmit}
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
