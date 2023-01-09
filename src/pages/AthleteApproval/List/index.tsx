import { useState } from 'react';
import { Badge } from '../../../components/Badge';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGlobal } from '../../../contexts/global.context';
import { useGetAppovalList } from '../../../dataAccess/hooks/athlete/useGetApprovalList';
import { Status } from '../../../enums/Status';
import { useAthleteApprovalList } from '../useAthleteApprovalList';
import { ActionButton } from './ActionButton';

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-auto',
];

const COLUMN_NAME = ['Nome', 'Status', 'Time', 'Sexo', ''];

const BADGE_ACTIVE =
  'text-sm border font-bold text-light-on-primary-container bg-light-primary-container py-1 px-2 rounded-lg border-light-primary-container';
const BADGE_NORMAL =
  'text-sm border text-light-on-primary-container bg-transparent py-1 px-2 rounded-lg border-light-outline';

export function AthleteApprovalListPage() {
  const { tableData, setFilter, status, statusFilter, setStatusFilter } =
    useAthleteApprovalList();

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
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
      <div>
        <span className="text-sm text-light-on-surface-variant">
          Filtro por status:
        </span>
        <div className="flex gap-2 justify-start pb-8">
          <button
            type="button"
            className={
              statusFilter === Status.PENDING ? BADGE_ACTIVE : BADGE_NORMAL
            }
            onClick={() => setStatusFilter(Status.PENDING)}
          >
            Pendente
          </button>
          <button
            type="button"
            className={
              statusFilter === Status.REJECTED ? BADGE_ACTIVE : BADGE_NORMAL
            }
            onClick={() => setStatusFilter(Status.REJECTED)}
          >
            Rejeitado
          </button>
          <button
            type="button"
            className={
              statusFilter === Status.ACTIVE ? BADGE_ACTIVE : BADGE_NORMAL
            }
            onClick={() => setStatusFilter(Status.ACTIVE)}
          >
            Aprovado
          </button>
        </div>
      </div>

      {status === 'loading' && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Buscando dados ...
        </p>
      )}

      {status === 'success' && tableData.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhuma ficha de atleta encontrada
        </p>
      )}

      {status === 'success' && tableData.length > 0 && (
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
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2 line-clamp-1`}>
                  {data.team?.name}
                </td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {data.gender || '-'}
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
