import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasPermission } from '../../../hooks/useHasPermission';
import { Roles } from '../../../enums/Roles';
import { useGetAllTechnicalComittee } from '../../../dataAccess/hooks/technicalComittee/useGetAllTechnicalComittee';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
import { Button } from '../../../components/Inputs/Button';
import { SelectBare } from '../../../components/Inputs/SelectBare';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';
import { ActionButtons } from '../../TechnicalCommittee/List/ActionButtons';
import { useGetAllPartnerProjects } from '../../../dataAccess/hooks/partnerProject/useGetAllPartnerProjects';
import { DateService } from '../../../services/DateService';
import { useGetPublicFederations } from '../../../dataAccess/hooks/public/useGetPublicFederation';
import { ActionsButtons } from './ActionsButton';

const COLUMN_WIDTH = [
  'w-1/2 lg:w-1/4',
  'hidden lg:table-cell lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-1/2 lg:w-1/5',
  'hidden lg:table-cell lg:w-1/5',
  'w-auto',
];

const COLUMN_NAMES = [
  'Nome do projeto',
  'Início',
  'Fim',
  'Qta de praticantes',
  'Relacionado',
  '',
];

export function PartnerProjectListPage() {
  const navigate = useNavigate();
  const canCreate = useHasPermission([
    Roles.ADMINCLUBE,
    Roles.ADMIN,
    Roles.ADMINFEDERACAO,
  ]);

  const { data, isLoading, isError, isSuccess } = useGetAllPartnerProjects();
  const { data: publicFederation } = useGetPublicFederations();
  const { data: publicTeams } = useGetPublicTeams();

  const [filter, setFilter] = useState('');
  const [filterFederation, setFilterFederation] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  let tableData = data || [];

  if (filterFederation) {
    tableData = tableData.filter(pp => pp?.relatedId === filterFederation);
  }

  if (filterTeam)
    tableData = tableData.filter(team => team?.relatedId === filterTeam);

  if (filter) {
    tableData = tableData.filter(user =>
      user?.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">Projeto de parceiros</h2>
        {canCreate && (
          <Button
            aditionalClasses="w-full lg:w-auto px-6"
            type="button"
            label="Criar projeto de parceria"
            onClick={() => navigate('/app/projetosparceiros/cadastro')}
          />
        )}
      </div>
      <div className="flex flex-col justify-end lg:flex-row gap-2 mb-4">
        <div className="w-full lg:w-1/3">
          <SelectBare
            label="Federação"
            name="federation-filter"
            onChange={e => setFilterFederation(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="CBHG - Administração">CBHG - Administração</option>
            {publicFederation?.list.map(federation => (
              <option key={federation.id} value={federation.id}>
                {federation.name}
              </option>
            ))}
          </SelectBare>
        </div>
        <div className="w-full lg:w-1/3">
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
        </div>
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

      {isSuccess && tableData.length === 0 && (
        <p className="text-center mt-8 text-light-on-surface-variant">
          Nenhum projeto parceiro cadastrado
        </p>
      )}

      {isSuccess && tableData.length > 0 && (
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
            {tableData.map(pp => (
              <tr
                className="border-b last:border-none border-slate-200"
                key={pp?.id}
              >
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>{pp?.name}</td>
                <td className={`${COLUMN_WIDTH[1]} py-4 px-2`}>
                  {DateService().format(pp!.initialDate) || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {DateService().format(pp!.finalDate) || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {pp?.practitioners || '0'}
                </td>
                <td className={`${COLUMN_WIDTH[2]} py-4 px-2`}>
                  {pp?.related?.name || 'Não encontrado'}
                </td>
                <td className={`${COLUMN_WIDTH[0]} py-4 px-2`}>
                  <ActionsButtons id={pp!.id!} relatedId={pp!.relatedId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
