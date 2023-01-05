import { MdInfo } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import { DateService } from '../../../services/DateService';
import { Status } from '../../../enums/Status';
import { Badge } from '../../../components/Badge';
import { defineAthleteCategory } from '../../../services/defineAthleteCategory';
import { useGetOneAthlete } from '../../../dataAccess/hooks/athlete/useGetOneAthlete';
import { WaitingApprovalMessage } from '../../../components/WaitingApprovalMessage';

const USER_NOT_FOUND_IMG =
  'https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/1A1A1A/external-user-user-tanah-basah-glyph-tanah-basah-4.png';

export function AthleteDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetOneAthlete(id);

  return (
    <>
      {data?.status !== Status.ACTIVE && <WaitingApprovalMessage id={id} />}
      <div className="bg-light-surface p-6 rounded-2xl h-full">
        {!isLoading && isSuccess && data ? (
          <>
            <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
              <figure className="w-24 h-24 rounded-full">
                <img
                  src={data?.photoUrl || USER_NOT_FOUND_IMG}
                  alt={data?.name}
                  className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
                />
              </figure>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-4xl text-light-on-surface-variant">
                    {data?.name}
                  </h2>
                  {data?.status === Status.ACTIVE && (
                    <Badge type="primary">Ativo</Badge>
                  )}
                  {data?.status === Status.PENDING && (
                    <Badge type="warning">Pendente</Badge>
                  )}
                  {data?.status === Status.REJECTED && (
                    <Badge type="error">Rejeitado</Badge>
                  )}
                  {data?.status === Status.INACTIVE && (
                    <Badge type="error">Inativo</Badge>
                  )}
                </div>
                <p className="text-2xl text-light-on-surface-variant">
                  {data?.related?.name || 'Sem time'} -{' '}
                  {defineAthleteCategory(data!.athleteProfile!.birthDate)}
                </p>
              </div>
            </div>
            <div className="mb-8 flex gap-4">
              <div>
                <MdInfo
                  size="1.75rem"
                  className="text-light-on-surface-variant"
                />
              </div>
              <div>
                <h2 className="text-3xl text-light-on-surface-variant">
                  Detalhes
                </h2>

                <p className="text-light-on-surface-variant">
                  <strong>Nº Registro: </strong>
                  {data?.athleteProfile?.registerNumber}
                </p>
                <p className="text-light-on-surface-variant">
                  <strong>Data de nascimento: </strong>
                  {DateService().format(data!.athleteProfile!.birthDate!)}
                </p>
                <p className="text-light-on-surface-variant">
                  <strong>País de origem: </strong>
                  {data?.athleteProfile?.country}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-3xl text-light-on-surface-variant">
              Carregando...
            </h2>
          </div>
        )}
      </div>
    </>
  );
}
