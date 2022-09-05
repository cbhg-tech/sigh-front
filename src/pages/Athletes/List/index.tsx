/* eslint-disable no-console */
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { MdEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { useState } from 'react';
import { IconButton } from '../../../components/Inputs/IconButton';
import { SelectBare } from '../../../components/Inputs/SelectBare';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { Button } from '../../../components/Inputs/Button';

interface IAthlete {
  id: string;
  name: string;
  team: string;
  category: string;
  sex: string;
  status: string;
}

// create an array of fake data using IAthlete
const fakeData = [
  {
    id: '1',
    name: 'Rafael',
    team: 'Deodoro',
    category: 'Adulto',
    sex: 'Masculino',
    status: 'ativo',
  },
  {
    id: '2',
    name: 'Bruno',
    team: 'Deodoro',
    category: 'Adulto',
    sex: 'Masculino',
    status: 'ativo',
  },
  {
    id: '3',
    name: 'Pedro',
    team: 'Deodoro',
    category: 'Adulto',
    sex: 'Masculino',
    status: 'ativo',
  },
];

const columns: ColumnDef<IAthlete>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'team',
    header: 'Clube',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'category',
    header: 'Categoria',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
          icon={AiOutlineEye}
          className="text-light-tertiary"
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

export function AthletesListPage() {
  const [data] = useState<Array<IAthlete>>([...fakeData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface mb-4">
          Listagem de atletas
        </h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar atleta"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/4">
          <SelectBare label="Clube" name="team-filter">
            <option value="">Todos</option>
            <option value="">AABB - Canoas/RS</option>
            <option value="">AABB/ São Leopoldo</option>
            <option value="">Deodoro Hoquei Clube</option>
          </SelectBare>
        </div>
        <div className="w-full lg:w-1/4">
          <SelectBare label="Federação" name="federation-filter">
            <option value="">Todas</option>
            <option value="mg">
              Federação de Hóquei do Estado de Minas Gerais
            </option>
            <option value="sc">
              Federação de Hóquei do Estado de Santa Catarina
            </option>
            <option value="sp">
              Federação de Hóquei do Estado de São Paulo
            </option>
          </SelectBare>
        </div>
        <div className="w-full lg:w-1/2">
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
