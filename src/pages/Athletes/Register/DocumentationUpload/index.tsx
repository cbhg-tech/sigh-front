import { Button } from '../../../../components/Inputs/Button';
import { FileInput } from '../../../../components/Inputs/FIleInput';
import { useAthletesRegister } from '../register.context';

export function DocumentationUpload() {
  const { setDocuments } = useAthletesRegister();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Anexo Documento RG ou Passaporte"
          hint="Obrigatório para todos"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              personalDocument: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Atestado Médico"
          hint="Obrigatório para todos"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              medicalCertificate: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="Termo de compromisso"
          hint="(obrigatório menores de idade)"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              commitmentTerm: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1">
        <FileInput
          name="document"
          label="N.O.C"
          hint="(Somente para atletas que atuam no exterior)"
          onChange={e =>
            setDocuments(prev => ({
              ...prev,
              noc: e.target.files?.[0] || null,
            }))
          }
        />
      </div>
      <div className="col-span-1 lg:col-span-2 mt-4">
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
          />
          <Button
            type="submit"
            aditionalClasses="w-auto px-2"
            label="Salvar"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
