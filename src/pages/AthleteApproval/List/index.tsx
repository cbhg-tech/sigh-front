import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../components/Inputs/Button';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { useGetAppovalList } from '../../../dataAccess/hooks/athlete/useGetApprovalList';
import { useGetFederations } from '../../../dataAccess/hooks/federation/useGetFederations';
import { IUserApproval } from '../../../types/UserApproval';
import { ActionButton } from './ActionButton';

const columns: ColumnDef<IUserApproval>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'team',
    header: 'Time',
    cell: info => {
      const obj = info.getValue();

      // @ts-ignore
      return obj.name;
    },
  },
  {
    accessorKey: 'gender',
    header: 'Sexo',
    cell: info => info.getValue() || 'Não informado',
  },
  {
    header: '',
    accessorKey: 'id',
    cell: info => <ActionButton id={info.getValue() as string} />,
  },
];

const COLUMN_WIDTH = [
  'w-1/3 lg:w-1/4',
  'w-1/3 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-auto',
];

export function AthleteApprovalListPage() {
  const { data, isError, isLoading, isSuccess } = useGetAppovalList();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex justify-start">
        <h2 className="text-3xl text-light-on-surface">
          Aprovação da ficha de atletas
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
