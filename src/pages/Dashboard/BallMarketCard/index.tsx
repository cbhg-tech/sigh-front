import { BiTransferAlt } from 'react-icons/bi';

import dayjs from 'dayjs';
import ImgNotFound from '../../../assets/image-not-found.png';
import { Badge } from '../../../components/Badge';
import { ITransfer } from '../../../types/Transfer';
import { Status } from '../../../enums/Status';
import { DateService } from '../../../services/DateService';

interface IProps {
  transfer: ITransfer;
}

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function BallMarketCard({ transfer }: IProps) {
  function badgerGenerator(transfer: ITransfer) {
    if (transfer.status === Status.REJECTED) return 'Transferencia negada';

    if (transfer.currentTeamStatus !== Status.ACTIVE)
      return 'Pendente clube de origem';
    if (transfer.destinationTeamStatus !== Status.ACTIVE)
      return 'Pendente clube de destino';
    if (transfer.currentFederationStatus !== Status.ACTIVE)
      return 'Pendente federação de origem';
    if (transfer.destinationFederationStatus !== Status.ACTIVE)
      return 'Pendente federação de destino';
    if (transfer.cbhgStatus !== Status.ACTIVE) return 'Pendente confederação';

    return 'Transferência concluída';
  }

  return (
    <div className="flex flex-col bg-light-surface rounded-2xl p-6 mb-3">
      <div className="flex mb-4 gap-4 items-center">
        <img
          className="w-14 h-14 rounded-full object-cover"
          src={transfer.user?.photoUrl || USER_NOT_FOUND_IMG}
          alt="Foto de perfil do usuário"
        />
        <div>
          <p className="text-xl text-light-on-surface">{transfer.user?.name}</p>
        </div>
      </div>

      <div className="flex justify-between lg:justify-center items-center mb-4">
        <div className="flex flex-col items-center text-center w-32 shrink-0">
          <p className="text-light-on-surface-variant text-sm">Origem</p>
          <img
            className="w-24 h-24 rounded-full object-cover my-2"
            src={transfer.currentTeam?.logo || ImgNotFound}
            alt="Clube de origem"
          />
          <p className="line-clamp-1 text-light-on-surface">
            {transfer.currentTeam?.name}
          </p>
        </div>
        <BiTransferAlt size="2rem" className="text-light-on-surface-variant" />
        <div className="flex flex-col items-center text-center w-36 shrink-0">
          <p className="text-light-on-surface-variant text-sm">Destino</p>
          <img
            className="w-24 h-24 rounded-full object-cover my-2"
            src={transfer.destinationTeam?.logo || ImgNotFound}
            alt="Clube de destino"
          />
          <p className="line-clamp-1 text-light-on-surface">
            {transfer.destinationTeam?.name}
          </p>
        </div>
      </div>

      <div className="flex justify-between lg:justify-center gap-2">
        {transfer.status === Status.PENDING && (
          <Badge type="tertiary">Negociando</Badge>
        )}

        {transfer.status === Status.ACTIVE && (
          <Badge type="primary">Aprovado</Badge>
        )}

        {transfer.status === Status.REJECTED && (
          <Badge type="error">Melou!</Badge>
        )}

        <p className="text-light-on-surface-variant">
          {DateService().format(transfer.transferData, 'DD/MM/YYYY')}
        </p>
      </div>
      <div className="flex justify-center mt-2">
        <p className="text-light-on-surface-variant">
          {badgerGenerator(transfer)}
        </p>
      </div>
    </div>
  );
}
