import { useParams } from 'react-router-dom';
import { MdLink } from 'react-icons/md';

import { useGetOneFederation } from '../../../dataAccess/hooks/federation/useGetOneFederation';
import ImgNotFound from '../../../assets/image-not-found.png';
import { DateService } from '../../../services/DateService';

export function FederationDetailsPage() {
  const { id } = useParams();
  const { data } = useGetOneFederation(id);

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex gap-4 items-center mb-4">
        <figure className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container">
          <img
            className="w-24 h-24 z-0 rounded-full object-cover bg-light-secondary-container"
            src={data?.logo || ImgNotFound}
            alt="Logo da federação"
          />
        </figure>
        <h2 className="text-4xl text-light-on-surface-variant">
          {data?.name} - {data?.initials}
        </h2>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl text-light-on-surface-variant">Detalhes</h2>

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
      </div>
      <div>
        <h2 className="text-3xl text-light-on-surface-variant">Clubes</h2>
        <ul>
          {data?.teamsList.map(team => (
            <li
              className="py-4 flex gap-2 items-center text-light-on-surface-variant border-b border-light-outline last:border-none"
              key={team.id}
            >
              <img
                className="w-12 h-12 z-0 rounded-full object-cover bg-light-secondary-container"
                src={team.logo}
                alt={team.name}
              />
              <span>{team.name}</span>
              {/* TODO: adicionar link redirecionando para detalhes do time */}
              <MdLink size="1.25rem" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
