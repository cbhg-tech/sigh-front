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
import { Status } from '../../../enums/Status';
import { TransferRole } from '../../../enums/TransferRole';

export function TransferApprovalWorkflow() {
  const { id } = useParams();
  const { user } = useGlobal();
  const { data: transferData } = useGetOneTransfer(id);
  const { data: publicTeams } = useGetPublicTeams();
  const { mutateAsync } = useUpdateTransferDetails();

  const [obs, setObs] = useState('');

  const handleSubmit = async (isApproved: boolean) => {
    try {
      if (!transferData) throw new Error('Transferencia não foi achada');

      if (!obs) throw new Error('Observação é obrigatória');

      const destinationTeam = publicTeams?.list.find(
        team => team.id === transferData?.destinationTeamId,
      );
      const originTeam = publicTeams?.list.find(
        team => team.id === transferData?.currentTeamId,
      );
      let role = TransferRole.CLUBEDESTINO;
      let userType: 'federação' | 'clube' = 'federação';

      switch (user?.role) {
        case Roles.ADMINFEDERACAO:
          userType = 'federação';
          break;
        case Roles.ADMINCLUBE:
          userType = 'clube';
          break;
        default:
          throw new Error(
            'Você não tem permissão para aprovar essa transferência',
          );
      }

      if (
        userType === 'federação' &&
        user.federation?.id === originTeam?.federationId
      )
        role = TransferRole.FEDERACAOORIGEM;

      if (
        userType === 'federação' &&
        user.federation?.id === destinationTeam?.federationId
      )
        role = TransferRole.FEDERACAODESTINO;

      if (userType === 'clube' && user.team?.id === originTeam?.id)
        role = TransferRole.CLUBEORIGEM;

      if (userType === 'clube' && user.team?.id === destinationTeam?.id)
        role = TransferRole.CLUBEDESTINO;

      const log = {
        obs,
        status: isApproved ? 'Aprovado' : 'Rejeitado',
        role,
      };

      transferData.log.push(log);

      if (transferData.log.length === 4) {
        const isAllApproved = transferData.log.every(
          log => log.status === 'Aprovado',
        );

        transferData.status = isAllApproved ? 'Aprovado' : 'Negado';
      }

      await mutateAsync(transferData);

      setObs('');
      toast.success('Transferência aprovada com sucesso');
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">
        Solicitação de Transferência
      </h2>
      {transferData && (
        <>
          <p className="text-light-on-surface-variant">
            <strong>Jogador: </strong>
            {transferData.user.name}
            <br />
            <strong>Data de transferencia: </strong>
            {dayjs(transferData.transferData).format('DD/MM/YYYY')}
            <br />
            <strong>Clube de origem: </strong>
            {transferData.currentTeam}
            <br />
            <strong>Clube destino: </strong>
            {transferData.destinationTeam}
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
                  {log.status === 'Aprovado' ? (
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
      {transferData?.status !== 'Aprovado' && (
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
      )}
    </div>
  );
}
