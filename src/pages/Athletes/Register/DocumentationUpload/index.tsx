import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Button } from '../../../../components/Inputs/Button';
import { FileInput } from '../../../../components/Inputs/FileInput';
import { useGlobal } from '../../../../contexts/global.context';
import { usePutAthlete } from '../../../../dataAccess/hooks/athlete/usePutAthlete';
import { Status } from '../../../../enums/Status';
import { useAthletesRegister } from '../register.context';

export function DocumentationUpload() {
  const { user } = useGlobal();
  const { documents, setDocuments, setActiveTab } = useAthletesRegister();
  const { mutateAsync } = usePutAthlete();

  const handleFileUpload = async () => {
    const birthDate = user?.athleteProfile?.birthDate;
    const isSubEighteen = dayjs().diff(birthDate, 'year') < 18;

    if (!documents.personalDocument)
      toast.error('Documento pessoal obrigatório');

    if (isSubEighteen && !documents.commitmentTerm)
      toast.error('Termo de compromisso obrigatório');

    try {
      // @ts-ignore
      await mutateAsync({
        ...user?.athleteProfile,
        documentFiles: {
          ...documents,
        },
        documents: {
          commitmentTerm: '',
          personalDocument: '',
          medicalCertificate: '',
          noc: '',
        },
      });

      toast.success('Documentos enviados com sucesso!');

      if (user?.status !== Status.ACTIVE) {
        setActiveTab(2);
      }
    } catch (err) {
      // @ts-ignore
      toast.error(err.message);
    }
  };

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
          url={user?.athleteProfile?.documents?.personalDocument || ''}
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
          url={user?.athleteProfile?.documents?.medicalCertificate || ''}
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
          url={user?.athleteProfile?.documents?.commitmentTerm || ''}
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
          url={user?.athleteProfile?.documents?.noc || ''}
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
            type="button"
            aditionalClasses="w-auto px-2"
            label={user?.status === Status.ACTIVE ? 'Salvar' : 'Próximo passo'}
            variant="primary"
            onClick={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
}
