import { Form } from '@unform/web';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Divider } from '../../../../components/Divider';
import { Button } from '../../../../components/Inputs/Button';
import { FileInput } from '../../../../components/Inputs/FileInput';
import { Textfield } from '../../../../components/Inputs/Textfield';
import { useGlobal } from '../../../../contexts/global.context';
import { usePutAthlete } from '../../../../dataAccess/hooks/athlete/usePutAthlete';
import { Status } from '../../../../enums/Status';
import { validateForm } from '../../../../utils/validateForm';
import { useAthletesRegister } from '../register.context';
import { handleFormErrors } from '../../../../utils/handleFormErrors';

interface IFormData {
  rgNumber: string;
  rgEmissionDate: string;
  rgEmissionOrg: string;
}

export function DocumentationUpload() {
  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();
  const { documents, setDocuments, setActiveTab } = useAthletesRegister();
  const { mutateAsync } = usePutAthlete();

  const handleFileUpload = async (data: IFormData) => {
    const { rgEmissionDate, rgEmissionOrg, rgNumber } = data;
    const birthDate = user?.athleteProfile?.birthDate;
    const isSubEighteen = dayjs().diff(birthDate, 'year') < 18;

    if (!documents.personalDocument)
      toast.error('Documento pessoal obrigatório');

    if (isSubEighteen && !documents.commitmentTerm)
      toast.error('Termo de compromisso obrigatório');

    try {
      await validateForm(data, {
        rgNumber: Yup.string().required('Número do RG obrigatório'),
        rgEmissionDate: Yup.string().required('Data de emissão obrigatória'),
        rgEmissionOrg: Yup.string().required('Órgão de emissão obrigatório'),
      });

      // @ts-ignore
      await mutateAsync({
        ...user?.athleteProfile,
        documentFiles: {
          ...documents,
        },
        documents: {
          rgEmissionDate,
          rgEmissionOrg,
          rgNumber,
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
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      toast.error(err.message);
    }
  };

  return (
    <div>
      <Form
        ref={formRef}
        onSubmit={data => handleFileUpload(data)}
        initialData={{
          rgNumber: user?.athleteProfile?.documents?.rgNumber,
          rgEmissionDate: user?.athleteProfile?.documents?.rgEmissionDate,
          rgEmissionOrg: user?.athleteProfile?.documents?.rgEmissionOrg,
        }}
      >
        <h2 className="mb-4 text-2xl text-light-on-surface">Dados do RG</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="col-span-1">
            <Textfield label="Número do RG" name="rgNumber" />
          </div>
          <div className="col-span-1">
            <Textfield
              type="date"
              label="Data de emissão do RG"
              name="rgEmissionDate"
            />
          </div>
          <div className="col-span-1">
            <Textfield label="Orgão Emissor do RG" name="rgEmissionOrg" />
          </div>
        </div>

        <Divider />

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
                type="submit"
                aditionalClasses="w-auto px-2"
                label={
                  user?.status === Status.ACTIVE ? 'Salvar' : 'Próximo passo'
                }
                variant="primary"
              />
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
