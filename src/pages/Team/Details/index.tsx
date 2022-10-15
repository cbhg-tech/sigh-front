import { useParams } from 'react-router-dom';
import { MdFormatListBulleted, MdInfo, MdLink } from 'react-icons/md';

import { DateService } from '../../../services/DateService';
import { useGetOneTeam } from '../../../dataAccess/hooks/team/useGetOneTeam';

import ImgNotFound from '../../../assets/image-not-found.png';

export function TeamDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetOneTeam(id);

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      {!isLoading && isSuccess && data ? (
        <>
          <div className="flex gap-4 items-center mb-4">
            <figure className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container">
              <img
                className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
                src={data?.logo || ImgNotFound}
                alt="Logo do clube"
              />
            </figure>
            <div>
              <h2 className="text-4xl text-light-on-surface-variant">
                {data?.name} - {data?.initials}
              </h2>
              <p className="text-light-on-surface-variant">
                {data.email} | {data.url}
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
                <strong>Presidente: </strong>
                {data?.presidentName}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Mandato: </strong>
                {DateService().format(data!.beginningOfTerm)}
                {' - '}
                {DateService().format(data!.endOfTerm)}
              </p>
              <p className="text-light-on-surface-variant">
                <strong>Treinador: </strong>
                {data?.coachName}
              </p>
            </div>
          </div>
          <div className="mb-8 flex gap-4">
            <div>
              <MdFormatListBulleted
                size="1.75rem"
                className="text-light-on-surface-variant"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl text-light-on-surface-variant">
                Atletas
              </h2>
              <ul>
                {data?.users?.map(user => (
                  <li
                    className="py-4 flex gap-2 items-center text-light-on-surface-variant border-b border-light-outline last:border-none"
                    key={user.id}
                  >
                    <img
                      className="w-12 h-12 z-0 rounded-full object-cover bg-light-secondary-container"
                      src={user.photoUrl}
                      alt={user.name}
                    />
                    <span>{user.name}</span>
                    {/* TODO: adicionar link redirecionando para detalhes do time */}
                    <MdLink size="1.25rem" />
                  </li>
                ))}
              </ul>
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
  );
}
