import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../../../components/Inputs/Button';
import { SelectBare } from '../../../components/Inputs/SelectBare';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { ListActionButtons } from '../../../components/ListActionButtons';
import { useTechnicalOfficersList } from '../useTechnicalOfficersList';

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'w-auto',
];

const COLUMN_NAMES = ['Nome', 'Clube', 'Telefone', 'Email', ''];

export function TechnicalOfficersListPage() {
  const navigate = useNavigate();
  const {
    isAdmin,
    setFilter,
    setFilterTeam,
    tableData,
    publicTeams,
    getStatus,
    deleteTechnicalOfficer,
  } = useTechnicalOfficersList();

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">Oficiais Técnicos</h2>
        {isAdmin && (
          <Button
            aditionalClasses="w-full lg:w-auto px-6"
            type="button"
            label="Criar oficial técnico"
            onClick={() => navigate('/app/oficial/cadastro')}
          />
        )}
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          {isAdmin && (
            <SelectBare
              label="Clube"
              name="team-filter"
              onChange={e => setFilterTeam(e.target.value)}
            >
              <option value="">Todos</option>
              {publicTeams?.list.map(team => (
                <option value={team.id} key={team.id}>
                  {team.name}
                </option>
              ))}
            </SelectBare>
          )}
        </div>
        <div className="w-full lg:w-2/3">
          <TextfieldBare
            label="Buscar..."
            name="search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {getStatus === 'loading' && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Buscando dados ...
        </p>
      )}

      {getStatus === 'error' && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Error ao buscar dados, tente novamente
        </p>
      )}

      {getStatus === 'success' && tableData.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhum oficial tecnico cadastrado
        </p>
      )}

      {getStatus === 'success' && tableData.length > 0 && (
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
            {tableData.map(tc => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={tc.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>{tc.name}</td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {tc.related?.name || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {tc.phone || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {tc.email || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  <ListActionButtons
                    viewPermission={isAdmin}
                    editPermission={isAdmin}
                    deletePermission={isAdmin}
                    viewBtn={() => navigate(`/app/oficial/detalhes/${tc.id}`)}
                    editBtn={() => navigate(`/app/oficial/editar/${tc.id}`)}
                    deleteBtn={async () => {
                      if (
                        // eslint-disable-next-line no-alert
                        window.confirm(
                          'Deseja realmente apagar esse membro da comissão?',
                        )
                      ) {
                        await deleteTechnicalOfficer(tc.id!);

                        toast.success('Apagado com sucesso!');
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
