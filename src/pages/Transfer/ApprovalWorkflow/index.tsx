import dayjs from 'dayjs';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Badge } from '../../../components/Badge';
import { Divider } from '../../../components/Divider';
import { Button } from '../../../components/Inputs/Button';
import { MultineTextfieldBare } from '../../../components/Inputs/MultilineTextfieldBare';
import { useGlobal } from '../../../contexts/global.context';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { useGetOneTransfer } from '../../../dataAccess/hooks/transfer/useGetOneTransfer';
import { useUpdateTransferDetails } from '../../../dataAccess/hooks/transfer/useUpdateTransferDetail';
import { Roles } from '../../../enums/Roles';
import { TransferRole } from '../../../enums/TransferRole';
import { Status } from '../../../enums/Status';

export function TransferApprovalWorkflow() {
  const { id } = useParams();
  const { user } = useGlobal();
  const { data: transferData } = useGetOneTransfer(id);
  const { mutateAsync } = useUpdateTransferDetails();

  const [obs, setObs] = useState('');

  function canApproveWorkflow() {
    if (transferData?.status !== Status.ACTIVE) {
      if (
        user?.role === Roles.ADMINCLUBE &&
        transferData?.currentTeamId === user?.relatedId
      )
        return true;

      if (
        user?.role === Roles.ADMINCLUBE &&
        transferData?.destinationTeamId === user?.relatedId &&
        transferData?.currentTeamStatus === Status.ACTIVE
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        transferData?.currentFederationId === user?.relatedId &&
        transferData?.destinationTeamStatus === Status.ACTIVE
      )
        return true;

      if (
        user?.role === Roles.ADMINFEDERACAO &&
        transferData?.destinationFederationId === user?.relatedId &&
        transferData?.currentFederationStatus === Status.ACTIVE
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
    try {
      if (!transferData) throw new Error('Transferencia não foi achada');

      if (!obs) throw new Error('Observação é obrigatória');

      let role = TransferRole.CLUBEDESTINO;

      if (!canApproveWorkflow())
        throw new Error('Você não pode aprovar essa transferência');

      switch (user?.relatedId) {
        case transferData?.currentTeamId:
          role = TransferRole.CLUBEORIGEM;
          break;
        case transferData?.destinationTeamId:
          role = TransferRole.CLUBEDESTINO;
          break;
        case transferData?.currentFederationId:
          role = TransferRole.FEDERACAOORIGEM;
          break;
        case transferData?.destinationFederationId:
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

      transferData.log.push(log);

      if (
        transferData.currentTeamStatus === Status.ACTIVE &&
        transferData.destinationTeamStatus === Status.ACTIVE &&
        transferData.currentFederationStatus === Status.ACTIVE &&
        transferData.destinationFederationStatus === Status.ACTIVE &&
        user?.relatedId === 'CBHG - Administração' &&
        isApproved
      ) {
        transferData.status = Status.ACTIVE;
      }

      await mutateAsync(transferData);

      setObs('');

      toast.success('Transferência aprovada com sucesso');
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  }

  function waitingMessage() {
    if (
      user?.role === Roles.ADMINCLUBE &&
      transferData?.destinationTeamId === user?.relatedId &&
      transferData?.currentTeamStatus !== Status.ACTIVE
    ) {
      return 'Aguardando aprovação do time de origem';
    }

    if (
      user?.role === Roles.ADMINFEDERACAO &&
      transferData?.currentFederationId === user?.relatedId &&
      transferData?.destinationTeamStatus !== Status.ACTIVE
    ) {
      return 'Aguardando aprovação do time de destino';
    }

    if (
      user?.role === Roles.ADMINFEDERACAO &&
      transferData?.destinationFederationId === user?.relatedId &&
      transferData?.currentFederationStatus !== Status.ACTIVE
    ) {
      return 'Aguardando aprovação da federação de origem';
    }

    if (
      user?.role === Roles.ADMIN &&
      transferData?.destinationFederationStatus !== Status.ACTIVE
    ) {
      return 'Aguardando aprovação da federação de destino';
    }
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
                {log.role}

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
