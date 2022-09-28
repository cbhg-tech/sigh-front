import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef } from 'react';
import { MdOutlineAccountCircle, MdOutlineRoom } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../../components/Inputs/Button';
import { Select } from '../../../../components/Inputs/Select';
import { Textfield } from '../../../../components/Inputs/Textfield';
import { useGlobal } from '../../../../contexts/global.context';
import { IUpdateAthlete } from '../../../../dataAccess/controllers/athlete.controller';
import { usePutAthlete } from '../../../../dataAccess/hooks/athlete/usePutAthlete';
import { States } from '../../../../dataAccess/static/states';
import { handleFormErrors } from '../../../../utils/handleFormErrors';
import { validateForm } from '../../../../utils/validateForm';

export function BasicData() {
  const { innerWidth: width } = window;

  const isDesktop = width > 1024;

  const formRef = useRef<FormHandles>(null);
  const { user } = useGlobal();

  const { mutateAsync, isLoading } = usePutAthlete();

  const handleSubmit = async (data: IUpdateAthlete) => {
    formRef.current?.setErrors({});

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        birthDate: Yup.string().required('Data de nascimento obrigatória'),
        phone: Yup.string().required('Celular obrigatório'),
        gender: Yup.string().required('Gênero obrigatório'),
        country: Yup.string().required('País de origem obrigatório'),
        address: Yup.object({
          city: Yup.string().required('Cidade obrigatória'),
          state: Yup.string().required('Estado obrigatório'),
          cep: Yup.string().required('CEP obrigatório'),
          street: Yup.string().required('Rua obrigatória'),
          number: Yup.string().required('Número obrigatório'),
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
        className="grid grid-cols-6 lg:grid-cols-12 gap-2"
        initialData={user?.athleteProfile}
      >
        <div className="col-span-1">
          <MdOutlineAccountCircle
            size={isDesktop ? '2.25rem' : '1.5rem'}
            className="mx-auto mt-2 text-light-on-surface"
          />
        </div>
        <div className="col-span-5 lg:col-span-11">
          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-4">
              <Textfield name="name" label="Nome completo*" />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <Textfield name="nickname" label="Apelido" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-2">
              <Textfield
                type="date"
                name="birthDate"
                label="Data de nascimento*"
              />
            </div>
            <div className="col-span-1 lg:col-span-4">
              <Textfield name="phone" label="Celular*" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-4">
              <Textfield name="country" label="País de origem*" />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <Select name="gender" label="Sexo*">
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <MdOutlineRoom
            size={isDesktop ? '2.25rem' : '1.5rem'}
            className="mx-auto mt-2 text-light-on-surface"
          />
        </div>

        <div className="col-span-5 lg:col-span-11 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-3">
              <Textfield name="address.cep" label="CEP*" />
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Textfield name="address.street" label="Endereço completo*" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-4">
              <Textfield name="address.complement" label="Complemento" />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <Textfield name="address.number" label="Número*" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-2">
            <div className="col-span-1 lg:col-span-3">
              <Select name="address.state" label="Estado*">
                <option value="">Selecione um estado</option>
                {States.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <Textfield name="address.city" label="Cidade*" />
            </div>
          </div>
        </div>

        <div className="col-span-6 lg:col-span-12 mt-4">
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
