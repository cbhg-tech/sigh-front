import { useState } from 'react';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGlobal } from '../../../contexts/global.context';
import { useGetAppovalList } from '../../../dataAccess/hooks/athlete/useGetApprovalList';
import { ActionButton } from './ActionButton';

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-auto',
];

const COLUMN_NAME = ['Nome', 'Status', 'Time', 'Sexo', ''];

export function AthleteApprovalListPage() {
  const { user } = useGlobal();
  const { data, isError, isLoading, isSuccess } = useGetAppovalList(
    user?.team?.id,
  );
  const [filter, setFilter] = useState('');

  let tableData = data || [];

  if (filter) {
    tableData = tableData.filter(athlete =>
      athlete.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex justify-start">
        <h2 className="text-3xl text-light-on-surface">
          Aprovação da ficha de atletas
        </h2>
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

      {isSuccess && (
        <table className="w-full">
          <thead>
            <tr>
              {COLUMN_NAME.map((columnName, index) => (
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
            {tableData.map(data => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={data.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>{data.name}</td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {data.status}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {data.team.name}
                </td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {data.gender || 'Não informado'}
                </td>
                <td className={`${COLUMN_WIDTH[4]} py-4 px-2`}>
                  <ActionButton id={data.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
