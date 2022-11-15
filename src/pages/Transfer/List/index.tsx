import dayjs from 'dayjs';
import { useState } from 'react';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetAllTransfers } from '../../../dataAccess/hooks/transfer/useGetAllTransfers';
import { ITransfer } from '../../../types/Transfer';
import { Status } from '../../../enums/Status';
import { Badge } from '../../../components/Badge';
import { ActionsButtons } from './ActionsButton';

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-1/3 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAME = [
  'Clube de origem',
  'Clube de destino',
  'Nome',
  'Data da transferencia',
  'Situação',
  '',
];

export function ListTransfersPage() {
  const { data, isLoading, isSuccess } = useGetAllTransfers();
  const [filter, setFilter] = useState('');

  let tableData = data || [];

  if (filter) {
    tableData = tableData.filter(transfer =>
      transfer.user?.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  function badgerGenerator(transfer: ITransfer) {
    if (transfer?.status === Status.REJECTED) return 'Transferência rejeitada';

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
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex justify-start">
        <h2 className="text-3xl text-light-on-surface">
          Listagem de transferencias
        </h2>
      </div>

      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare
            label="Buscar por usuário..."
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

      {!isLoading && tableData.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhuma transferencia encontrada
        </p>
      )}

      {!isLoading && tableData.length > 0 && isSuccess && (
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
            {tableData.map(row => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={row.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  {row.user?.name}
                </td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {row.currentTeam?.name}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {row.destinationTeam?.name}
                </td>
                <td className={`${COLUMN_WIDTH[3]} py-4 px-2`}>
                  {dayjs(row.transferData).format('DD/MM/YYYY') ||
                    'Data não informada'}
                </td>
                <td className={`${COLUMN_WIDTH[4]} py-4 px-2`}>
                  <Badge
                    type={
                      badgerGenerator(row) === 'Transferência concluída'
                        ? 'primary'
                        : 'warning'
                    }
                  >
                    {badgerGenerator(row)}
                  </Badge>
                </td>
                <td>
                  <ActionsButtons id={row.id!} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
