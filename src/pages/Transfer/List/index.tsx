import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';

import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetAllTransfers } from '../../../dataAccess/hooks/transfer/useGetAllTransfers';
import { ITransfer } from '../../../types/Transfer';
import { ActionButton } from './ActionButton';

const columns: ColumnDef<ITransfer>[] = [
  {
    accessorKey: 'user',
    header: 'Nome',
    cell: info => {
      const user = info.getValue();

      // @ts-ignore
      return user.name;
    },
  },
  {
    accessorKey: 'currentTeam',
    header: 'Clube de origem',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'destinationTeam',
    header: 'Clube de destino',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'transferData',
    header: 'Data da transferencia',
    cell: info => {
      const date = info.getValue() as string;

      if (!date) return 'Data não informada';

      return dayjs(date).format('DD/MM/YYYY');
    },
  },
  {
    header: '',
    accessorKey: 'id',
    cell: info => <ActionButton id={info.getValue() as string} />,
  },
];

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-1/3 lg:w-1/4',
  'w-auto',
];

export function TransferListPage() {
  const { data, isError, isLoading, isSuccess } = useGetAllTransfers();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex justify-start">
        <h2 className="text-3xl text-light-on-surface">
          Aprovação da transferencia de atletas
        </h2>
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare label="Buscar..." name="search" />
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
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    className={`${COLUMN_WIDTH[index]} text-left py-4 px-2 bg-slate-100`}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    className={`${COLUMN_WIDTH[index]} py-4 px-2`}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
