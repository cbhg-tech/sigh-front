import dayjs from 'dayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdOpenInNew } from 'react-icons/md';
import { Badge } from '../../../components/Badge';
import { Divider } from '../../../components/Divider';
import { Button } from '../../../components/Inputs/Button';
import { MultineTextfieldBare } from '../../../components/Inputs/MultilineTextfieldBare';
import { useGlobal } from '../../../contexts/global.context';
import { useUpdateTransferDetails } from '../../../dataAccess/hooks/transfer/useUpdateTransferDetail';
import { TransferRole } from '../../../enums/TransferRole';
import { Status } from '../../../enums/Status';
import { useTransfer } from '../useTransfer';

interface IProps {
  isDisplayOnly?: boolean;
}

export function TransferApprovalWorkflow({ isDisplayOnly }: IProps) {
  const { id } = useParams();
  const { user } = useGlobal();
  const { canApproveWorkflow, oneTransfer, queryOneStatus } = useTransfer({
    fetchAll: false,
    transferId: id,
  });
  // const { data: transferData } = useGetOneTransfer(id);
  const { mutateAsync } = useUpdateTransferDetails();

  const [obs, setObs] = useState('');

  async function handleSubmit(isApproved: boolean) {
    if (isDisplayOnly) return;

    try {
      if (!oneTransfer) throw new Error('Transferencia não foi achada');

      if (!obs) throw new Error('Observação é obrigatória');

      let role = TransferRole.CLUBEDESTINO;

      if (!canApproveWorkflow(oneTransfer, isDisplayOnly))
        throw new Error('Você não pode aprovar essa transferência');

      const newTransferData = { ...oneTransfer };

      const isAprovedByTeams =
        oneTransfer.currentTeamStatus === Status.ACTIVE &&
        oneTransfer.destinationTeamStatus === Status.ACTIVE;
      const isNotAprovedByFederations =
        oneTransfer.currentFederationStatus !== Status.ACTIVE &&
        oneTransfer.destinationFederationStatus !== Status.ACTIVE;

      if (
        // prettier-ignore
        oneTransfer.destinationFederationId === oneTransfer.currentFederationId &&
        isAprovedByTeams &&
        isNotAprovedByFederations
      ) {
        newTransferData.destinationFederationStatus = isApproved
          ? Status.ACTIVE
          : Status.REJECTED;
        newTransferData.currentFederationStatus = isApproved
          ? Status.ACTIVE
          : Status.REJECTED;

        role = TransferRole.FEDERACAOORIGEM;
      } else {
        switch (user?.relatedId) {
          case newTransferData?.currentTeamId:
            newTransferData.currentTeamStatus = isApproved
              ? Status.ACTIVE
              : Status.REJECTED;
            role = TransferRole.CLUBEORIGEM;
            break;
          case newTransferData?.destinationTeamId:
            newTransferData.destinationTeamStatus = isApproved
              ? Status.ACTIVE
              : Status.REJECTED;
            role = TransferRole.CLUBEDESTINO;
            break;
          case newTransferData?.currentFederationId:
            newTransferData.currentFederationStatus = isApproved
              ? Status.ACTIVE
              : Status.REJECTED;
            role = TransferRole.FEDERACAOORIGEM;
            break;
          case newTransferData?.destinationFederationId:
            newTransferData.destinationTeamStatus = isApproved
              ? Status.ACTIVE
              : Status.REJECTED;
            role = TransferRole.FEDERACAODESTINO;
            break;
          case 'CBHG - Administração':
          default:
            newTransferData.cbhgStatus = isApproved
              ? Status.ACTIVE
              : Status.REJECTED;
            role = TransferRole.CONFEDERACAO;
            break;
        }
      }

      const log = {
        obs,
        status: isApproved ? Status.ACTIVE : Status.REJECTED,
        role,
        createdAt: new Date(),
      };

      newTransferData.log.push(log);

      if (
        newTransferData.currentTeamStatus === Status.ACTIVE &&
        newTransferData.destinationTeamStatus === Status.ACTIVE &&
        newTransferData.currentFederationStatus === Status.ACTIVE &&
        newTransferData.destinationFederationStatus === Status.ACTIVE &&
        user?.relatedId === 'CBHG - Administração' &&
        isApproved
      ) {
        newTransferData.status = Status.ACTIVE;
      }

      if (!isApproved) {
        newTransferData.status = Status.REJECTED;
      }

      await mutateAsync(newTransferData);

      setObs('');

      toast.success('Transferência aprovada com sucesso');
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  }

  function waitingMessage() {
    if (oneTransfer?.currentTeamStatus !== Status.ACTIVE)
      return 'Pendente aprovação do clube de origem';
    if (oneTransfer?.destinationTeamStatus !== Status.ACTIVE)
      return 'Pendente aprovação do clube de destino';
    if (oneTransfer?.currentFederationStatus !== Status.ACTIVE)
      return 'Pendente aprovação da federação de origem';
    if (oneTransfer?.destinationFederationStatus !== Status.ACTIVE)
      return 'Pendente aprovação da federação de destino';
    if (oneTransfer?.cbhgStatus !== Status.ACTIVE)
      return 'Pendente aprovação da confederação';

    return 'Transferência concluída';
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">
        Solicitação de Transferência
      </h2>
      {queryOneStatus === 'loading' && (
        <div>
          <p>Carregando...</p>
        </div>
      )}
      {queryOneStatus === 'success' && oneTransfer && (
        <>
          <p className="text-light-on-surface-variant">
            <strong>Jogador: </strong>
            {oneTransfer.user?.name}
            <br />
            <strong>Data de transferencia: </strong>
            {dayjs(oneTransfer.transferData).format('DD/MM/YYYY')}
            <br />
            <strong>Clube de origem: </strong>
            {oneTransfer.currentTeam?.name}
            <br />
            <strong>Clube destino: </strong>
            {oneTransfer.destinationTeam?.name}
            <br />
          </p>
          <p className="text-light-on-surface-variant">
            <strong>Observação: </strong>
            {oneTransfer.obs || 'Nenhuma observação'}
          </p>
          <a
            href={oneTransfer.documents.cbhgPaymentVoucher}
            target="_blank"
            download
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
            Comprovante de pagamento da CBHG
          </a>
          <br />
          {oneTransfer.documents.federationPaymentVoucher && (
            <>
              <a
                href={oneTransfer.documents.federationPaymentVoucher}
                target="_blank"
                download
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
                Comprovante de pagamento da federação
              </a>
              <br />
            </>
          )}
        </>
      )}
      <div>
        <h2 className="text-3xl text-light-on-surface my-4">Observações</h2>
        {oneTransfer && oneTransfer.log.length === 0 && (
          <div>
            <p className="text-light-on-surface-variant">
              Nenhuma observação adicionada
            </p>
          </div>
        )}
        {oneTransfer &&
          oneTransfer.log.length > 0 &&
          oneTransfer.log.map(log => (
            <div>
              <h3 className="text-light-on-surface my-2">
                <strong>{log.role}</strong>

                <span className="ml-2">
                  {log.status === Status.ACTIVE ? (
                    <Badge type="primary">Aprovado</Badge>
                  ) : (
                    <Badge type="error">Negado</Badge>
                  )}
                </span>
              </h3>
              <p className="text-light-on-surface-variant">{log.obs}</p>
              <Divider />
            </div>
          ))}
      </div>
      {canApproveWorkflow(oneTransfer, isDisplayOnly) ? (
        <div>
          <h2 className="text-3xl text-light-on-surface my-4">
            Você aprovar essa transferência?
          </h2>
          <MultineTextfieldBare
            name="obs"
            label="Observação"
            value={obs}
            onChange={e => setObs(e.target.value)}
          />
          <div className="flex gap-4">
            <Button
              label="Rejeitar"
              variant="error"
              onClick={() => handleSubmit(false)}
            />
            <Button
              label="Aceitar"
              variant="primary"
              onClick={() => handleSubmit(true)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-light-on-surface-variant">{waitingMessage()}</p>
        </div>
      )}
    </div>
  );
}
