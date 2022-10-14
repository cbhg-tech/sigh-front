/* eslint-disable no-console */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Inputs/Button';
import { useGetUsers } from '../../../dataAccess/hooks/user/useGetUsers';
import { ActionButtons } from './ActionButtons';

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAMES = ['Nome', 'Status', 'RoleAccess', 'Associação', ''];

export function UserListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isSuccess, isError } = useGetUsers();

  const [filter, setFilter] = useState('');

  let tableData = data || [];

  if (filter) {
    tableData = tableData.filter(user =>
      user.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de usuários {`(${data?.length || 0})`}
        </h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar usuário"
          onClick={() => navigate('/app/usuarios/cadastro')}
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
        <p className="text-center mt-8 text-light-on-surface-variant">
          Buscando dados ...
        </p>
      )}

      {isError && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Error ao buscar dados, tente novamente
        </p>
      )}

      {isSuccess && (
        <table className="w-full">
          <thead>
            <tr>
              {COLUMN_NAMES.map((columnName, index) => (
                <th
                  className={`${COLUMN_WIDTH[index]} text-left py-4 px-2 bg-slate-100`}
                  key={columnName}
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map(user => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={user.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>{user.name}</td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {user.status}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  <Badge type="tertiary">{user.status}</Badge>
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {user.relatedName}
                </td>
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  <ActionButtons id={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
