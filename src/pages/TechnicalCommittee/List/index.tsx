import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { TextfieldBare } from '../../../components/Inputs/TextfieldBare';

export function TechnicalCommitteeListPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState('');

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h2 className="text-3xl text-light-on-surface">Comissão Técnica</h2>
        <Button
          aditionalClasses="w-full lg:w-auto px-6"
          type="button"
          label="Criar usuário"
          onClick={() => navigate('/app/usuarios/cadastro')}
        />
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

      <p className="text-center mt-8 text-light-on-surface-variant">
        Nenhuma federação cadastrada
      </p>

      {filter && <p>Filtrado por: {filter}</p>}
    </div>
  );
}
