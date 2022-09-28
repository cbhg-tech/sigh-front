import { useRef } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { toast } from 'react-toastify';
import { Button } from '../../../../components/Inputs/Button';
import { Textfield } from '../../../../components/Inputs/Textfield';
import { useGlobal } from '../../../../contexts/global.context';
import { IUpdateAthlete } from '../../../../dataAccess/controllers/athlete.controller';
import { usePutAthlete } from '../../../../dataAccess/hooks/athlete/usePutAthlete';
import { validateForm } from '../../../../utils/validateForm';
import { handleFormErrors } from '../../../../utils/handleFormErrors';

export function HospitalData() {
  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();

  const { mutateAsync, isLoading } = usePutAthlete();

  const handleSubmit = async (data: IUpdateAthlete) => {
    formRef.current?.setErrors({});

    try {
      await validateForm(data, {
        hospitalData: Yup.object({
          bloodType: Yup.string().required('Tipo sanguíneo obrigatória'),
          allergies: Yup.string().required('Alergias obrigatória'),
          chronicDiseases: Yup.string().required('Doenças obrigatória'),
          medications: Yup.string().required('Medicações obrigatória'),
        }),
        emergencyContact: Yup.object({
          name: Yup.string().required(
            'Nome do contato de emergencia obrigatório',
          ),
          phone: Yup.string().required(
            'Celular do contato de emergencia obrigatório',
          ),
        }),
      });

      await mutateAsync({ ...user?.athleteProfile, ...data });

      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      // @ts-ignore
      if (err.message === 'Usuário inativo') {
        return toast.error('Usuário inativo');
      }

      toast.error('Ops! Não foi possivel salvar dados!');
    }
  };

  return (
    <div>
      <Form
        ref={formRef}
        onSubmit={data => handleSubmit(data)}
        initialData={user?.athleteProfile}
        className="grid grid-cols-1 lg:grid-cols-3 gap-2"
      >
        <div className="col-span-1">
          <Textfield name="hospitalData.bloodType" label="Tipo sanguíneo" />
        </div>
        <div className="col-span-1">
          <Textfield name="hospitalData.allergies" label="Lista de alergias" />
        </div>
        <div className="col-span-1">
          <Textfield
            name="hospitalData.chronicDiseases"
            label="Lista de doenças crônicas"
          />
        </div>
        <div className="col-span-1">
          <Textfield
            name="hospitalData.medications"
            label="Lista de medicamentos regulares"
          />
        </div>
        <div className="col-span-1">
          <Textfield
            name="emergencyContact.name"
            label="Nome do contato de emergência"
          />
        </div>
        <div className="col-span-1">
          <Textfield
            name="emergencyContact.phone"
            label="Numero do contato de emergência"
          />
        </div>
        <div className="col-span-1 lg:col-span-3 mt-4">
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
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </Form>
    </div>
  );
}
