import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useCreateUser } from '../../../dataAccess/hooks/user/useCreateUser';
import { Roles } from '../../../enums/Roles';
import { handleFormErrors } from '../../../utils/handleFormErrors';
import { validateForm } from '../../../utils/validateForm';

interface IForm {
  name: string;
  email: string;
  password: string;
  role: string;
  team: string;
}

export function UserRegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { mutateAsync, isLoading } = useCreateUser();

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        role: Yup.string().required('RoleAccess obrigatório'),
        team: Yup.string().required('Clube obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      await mutateAsync(data);

      toast.success('Usuário criado com sucesso!');

      navigate('/app/usuarios/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Email e senha não batem!');
    }
  }

  return (
    <div className="bg-light-surface p-6 rounded-2xl">
      <h2 className="text-3xl text-light-on-surface mb-2">
        Usuário administrador do sistema
      </h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> Somente faça o cadastro abaixo caso tenha
        certeza do acesso que esteja sendo criado. O usuário terá permissões
        para alterar dados da plataforma de acordo com o seu nível de acesso.
      </p>
      <Form ref={formRef} onSubmit={data => handleSubmit(data)}>
        <Textfield label="Nome" name="name" />
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <Select label="AccessRole" name="role">
              <option value={Roles.ADMIN}>Admin</option>
              <option value={Roles.ADMINFEDERACAO}>AdminFederacao</option>
              <option value={Roles.ADMINCLUBE}>AdminClube</option>
              <option value={Roles.COMISSAOTECNICA}>ComissaoTecnica</option>
              <option value={Roles.OFICIAL}>Oficial</option>
              <option value={Roles.USER}>Usuario</option>
            </Select>
          </div>
          <div className="flex-1">
            <Select label="Clube" name="team">
              <option value="CBHG - Administradores">
                CBHG - Administradores
              </option>
              <option value="AABB - Canoas/RS">AABB - Canoas/RS</option>
              <option value="AABB/ São Leopoldo<">AABB/ São Leopoldo</option>
              <option value="Deodoro Hoquei Clube">Deodoro Hoquei Clube</option>
            </Select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <Textfield type="email" name="email" label="Email" />
          </div>
          <div className="flex-1">
            <Textfield type="password" name="password" label="Senha" />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            variant="primary-border"
            type="submit"
            label="Cancelar"
            onClick={() => navigate('/app/usuarios/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            isLoading={isLoading}
            label="Criar usuário"
          />
        </div>
      </Form>
    </div>
  );
}
