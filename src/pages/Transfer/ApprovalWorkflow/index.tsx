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
import { useGetOneTransfer } from '../../../dataAccess/hooks/transfer/useGetOneTransfer';
import { useUpdateTransferDetails } from '../../../dataAccess/hooks/transfer/useUpdateTransferDetail';
import { Roles } from '../../../enums/Roles';
import { TransferRole } from '../../../enums/TransferRole';
import { Status } from '../../../enums/Status';

interface IProps {
  isDisplayOnly?: boolean;
}

export function TransferApprovalWorkflow({ isDisplayOnly }: IProps) {
  const { id } = useParams();
  const { user } = useGlobal();
  const { data: transferData } = useGetOneTransfer(id);
  const { mutateAsync } = useUpdateTransferDetails();

  const [obs, setObs] = useState('');

  function canApproveWorkflow() {
    if (isDisplayOnly) return false;

    if (transferData?.status !== Status.ACTIVE) {
      if (
        user?.role === Roles.ADMINCLUBE &&
        transferData?.currentTeamId === user?.relatedId &&
        !transferData?.log.find(log => log.role === TransferRole.CLUBEORIGEM)
      )
        return true;

      if (
        user?.role === Roles.ADMINCLUBE &&
        transferData?.destinationTeamId === user?.relatedId &&
        transferData?.currentTeamStatus === Status.ACTIVE &&
        !transferData?.log.find(log => log.role === TransferRole.CLUBEDESTINO)
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        transferData?.currentFederationId === user?.relatedId &&
        transferData?.destinationTeamStatus === Status.ACTIVE &&
        !transferData?.log.find(
          log => log.role === TransferRole.FEDERACAOORIGEM,
        )
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        transferData?.destinationFederationId === user?.relatedId &&
        transferData?.currentFederationStatus === Status.ACTIVE &&
        !transferData?.log.find(
          log => log.role === TransferRole.FEDERACAODESTINO,
        )
      )
        return true;

      if (
        user?.role === Roles.ADMIN &&
        transferData?.destinationFederationStatus === Status.ACTIVE
      )
        return true;
    }

    return false;
  }

  async function handleSubmit(isApproved: boolean) {
    if (isDisplayOnly) return;

    try {
      if (!transferData) throw new Error('Transferencia não foi achada');

      if (!obs) throw new Error('Observação é obrigatória');

      let role = TransferRole.CLUBEDESTINO;

      if (!canApproveWorkflow())
        throw new Error('Você não pode aprovar essa transferência');

      const newTransferData = { ...transferData };

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
          role = TransferRole.CONFEDERACAO;
          break;
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

      await mutateAsync(newTransferData);

      setObs('');

      toast.success('Transferência aprovada com sucesso');
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  }

  function waitingMessage() {
    if (transferData?.currentTeamStatus !== Status.ACTIVE)
      return 'Pendente clube de origem';
    if (transferData?.destinationTeamStatus !== Status.ACTIVE)
      return 'Pendente clube de destino';
    if (transferData?.currentFederationStatus !== Status.ACTIVE)
      return 'Pendente federação de origem';
    if (transferData?.destinationFederationStatus !== Status.ACTIVE)
      return 'Pendente federação de destino';
    if (transferData?.cbhgStatus !== Status.ACTIVE)
      return 'Pendente confederação';

    return 'Transferência concluída';
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">
        Solicitação de Transferência
      </h2>
      {transferData && (
        <>
          <p className="text-light-on-surface-variant">
            <strong>Jogador: </strong>
            {transferData.user?.name}
            <br />
            <strong>Data de transferencia: </strong>
            {dayjs(transferData.transferData).format('DD/MM/YYYY')}
            <br />
            <strong>Clube de origem: </strong>
            {transferData.currentTeam?.name}
            <br />
            <strong>Clube destino: </strong>
            {transferData.destinationTeam?.name}
            <br />
          </p>
          <p className="text-light-on-surface-variant">
            <strong>Observação: </strong>
            {transferData.obs || 'Nenhuma observação'}
          </p>
          <a
            href={transferData.documents.cbhgPaymentVoucher}
            target="_blank"
            download
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <MdOpenInNew size="1.25rem" className="text-light-on-surface" />
            Comprovante de pagamento da CBHG
          </a>
          <br />
          {transferData.documents.federationPaymentVoucher && (
            <>
              <a
                href={transferData.documents.federationPaymentVoucher}
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
        {transferData && transferData.log.length === 0 && (
          <div>
            <p className="text-light-on-surface-variant">
              Nenhuma observação adicionada
            </p>
          </div>
        )}
        {transferData &&
          transferData.log.length > 0 &&
          transferData.log.map(log => (
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
      {canApproveWorkflow() ? (
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
