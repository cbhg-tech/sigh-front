import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetTeams } from '../../../dataAccess/hooks/team/useGetTeams';
import { Roles } from '../../../enums/Roles';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { ActionsButtons } from './ActionsButton';

import ImgNotFound from '../../../assets/image-not-found.png';

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAMES = ['Nome', 'Federação', 'Email', 'Presidente', ''];

export function TeamListPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();
  const isAthlete = useHasPermission([Roles.USER]);
  const { data, isError, isLoading, isSuccess } = useGetTeams();
  const [filter, setFilter] = useState('');

  let tableData = data || [];

  tableData = tableData.filter(team =>
    team.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de clubes {`(${data?.length || 0})`}
        </h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar clube"
          onClick={() => navigate('/app/clubes/cadastro')}
        />
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare
            label="Buscar..."
            name="search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center mt-8">
          <p className="text-light-on-surface-variant text-xl">
            Buscando dados ...
          </p>
        </div>
      )}

      {isError && (
        <div className="text-center mt-8">
          <p className="text-light-on-error-container text-xl">
            Error ao buscar dados, tente novamente
          </p>
        </div>
      )}

      {isSuccess && data.length === 0 && (
        <p className="text-light-on-surface-variant text-center mt-8">
          Nenhum clube encontrado
        </p>
      )}

      {isSuccess && data.length > 0 && (
        <table className="w-full">
          <thead>
            <tr>
              {COLUMN_NAMES.map((columnName, index) => (
                <th
                  className={`${
                    COLUMN_WIDTH[index]
                  } text-left py-4 px-2 bg-slate-100 ${index === 0 && 'pl-14'}`}
                  key={columnName}
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map(team => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={team.id}
              >
                <td
                  className={`${COLUMN_WIDTH[0]} flex gap-2 items-center py-4 px-2`}
                >
                  <img
                    src={team.logo || ImgNotFound}
                    alt={team.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{team.name}</span>
                </td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {team.federation.name}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>{team.email}</td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {team.presidentName}
                </td>
                <td className={`${COLUMN_WIDTH[4]} py-4 px-2`}>
                  {!isAthlete && <ActionsButtons id={team.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
