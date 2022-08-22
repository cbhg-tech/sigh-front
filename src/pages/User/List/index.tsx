/* eslint-disable no-console */
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { Badge } from '../../../components/Badge';
import { Button } from '../../../components/Inputs/Button';
import { IUser } from '../../../types/User';
import { useGetUsers } from '../../../dataAccess/hooks/user/useGetUsers';
import { ActionButtons } from './ActionButtons';

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
    cell: info => <ActionButtons id={info.getValue() as string} />,
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

export function UserListPage() {
  const navigate = useNavigate();
  // const [data] = useState<Array<IUser>>([...fakeData]);
  const { data, isLoading, isSuccess, isError } = useGetUsers();

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">Listagem de usuários</h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar usuário"
          onClick={() => navigate('/app/usuarios/cadastro')}
        />
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
