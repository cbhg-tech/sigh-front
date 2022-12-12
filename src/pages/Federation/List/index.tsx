import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetFederations } from '../../../dataAccess/hooks/federation/useGetFederations';
import { Roles } from '../../../enums/Roles';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { useRedirectPendingAthlete } from '../../../hooks/useRedirectPendingAthlete';
import { ActionsButtons } from './ActionsButton';

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAME = ['Nome', 'Sigla', 'Estado', 'Presidente', ''];

export function FederationListPage() {
  useRedirectPendingAthlete();
  const navigate = useNavigate();

  const { data, isError, isLoading, isSuccess } = useGetFederations();
  const isAdmin = useHasPermission([Roles.ADMIN]);

  const [filter, setFilter] = useState('');

  let tableData = data || [];

  tableData = tableData.filter(federation =>
    federation.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de federação {`(${data?.length || 0})`}
        </h2>
        {isAdmin && (
          <Button
            aditionalClasses="w-full lg:w-auto px-6"
            type="button"
            label="Criar federação"
            onClick={() => navigate('/app/federacoes/cadastro')}
          />
        )}
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare
            label="Buscar..."
            name="search"
            value={filter}
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
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhuma federação cadastrada
        </p>
      )}

      {isSuccess && data.length > 0 && (
        <table className="w-full">
          <thead>
            <tr>
              {COLUMN_NAME.map((name, index) => (
                <th
                  className={`${COLUMN_WIDTH[index]} text-left py-4 px-2 bg-slate-100`}
                  key={name}
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map(federation => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={federation.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  {federation.name}
                </td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {federation.initials}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {federation.uf}
                </td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {federation.presidentName}
                </td>
                <td className={`${COLUMN_WIDTH[4]} py-4 px-2`}>
                  <ActionsButtons id={federation.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
