import { BiTransferAlt } from 'react-icons/bi';

import UserImg from '../../../assets/user-img.jpg';
import ImgNotFound from '../../../assets/image-not-found.png';
import { Badge } from '../../../components/Badge';

export function BallMarketCard() {
  return (
    <div className="flex flex-col bg-light-surface rounded-2xl p-6 mb-3">
      <div className="flex mb-4 gap-4 items-center">
        <img
          className="w-14 h-14 rounded-full object-cover"
          src={UserImg}
          alt="Foto de perfil do usuário"
        />
        <div>
          <p className="text-xl text-light-on-surface">Nome do atleta</p>
          <p className="text-light-on-surface-variant">Sub-18</p>
        </div>
      </div>

      <div className="flex justify-between lg:justify-center items-center mb-4">
        <div className="flex flex-col items-center text-center w-32 shrink-0">
          <p className="text-light-on-surface-variant text-sm">Origem</p>
          <img
            className="w-24 h-24 rounded-full object-cover my-2"
            src={ImgNotFound}
            alt="Clube de origem"
          />
          <p className="line-clamp-1 text-light-on-surface">
            Deodoro Hockei Clube
          </p>
        </div>
        <BiTransferAlt size="2rem" className="text-light-on-surface-variant" />
        <div className="flex flex-col items-center text-center w-36 shrink-0">
          <p className="text-light-on-surface-variant text-sm">Destino</p>
          <img
            className="w-24 h-24 rounded-full object-cover my-2"
            src={ImgNotFound}
            alt="Clube de destino"
          />
          <p className="line-clamp-1 text-light-on-surface">Rio Hockei Clube</p>
        </div>
      </div>

      <div className="flex justify-between lg:justify-center gap-2">
        <Badge type="tertiary">Negociando</Badge>
        <p className="text-light-on-surface-variant">21/09/2022</p>
      </div>
    </div>
  );
}
