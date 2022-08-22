/* eslint-disable no-console */
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { useState } from 'react';
import { IconButton } from '../../../components/Inputs/IconButton';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Inputs/Button';

interface IUser {
  id: string;
  name: string;
  team: string;
  role: string;
  status: string;
}

// create an array of fake data using IAthlete
const fakeData = [
  {
    id: '1',
    name: 'ADMIN',
    team: 'CBHG',
    role: 'ADMIN',
    status: 'ativo',
  },
];

const columns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'status',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'role',
    header: 'RoleAccess',
    cell: info => {
      return <Badge type="tertiary">{info.getValue() as string}</Badge>;
    },
  },
  {
    accessorKey: 'team',
    header: 'Clube',
    cell: info => info.getValue(),
  },
  {
    header: '',
    accessorKey: 'id',
    cell: info => (
      <div className="flex gap-2 items-center justify-end">
        <IconButton
          icon={MdEdit}
          className="text-light-primary"
          size="1.5rem"
          onClick={() => console.log(info.getValue())}
        />
        <IconButton
          icon={MdOutlineDeleteOutline}
          className="text-light-error"
          size="1.5rem"
          onClick={() => console.log(info.getValue())}
        />
      </div>
    ),
  },
];

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell w-1/2 lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

export function ListUsersPage() {
  const [data] = useState<Array<IUser>>([...fakeData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Listagem de usuários
        </h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar usuário"
        />
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <TextfieldBare label="Buscar..." name="search" />
        </div>
      </div>
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
    </div>
  );
}
