import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';
import { useGetPublicFederations } from '../../../dataAccess/hooks/public/useGetPublicFederation';
import { useGetPublicTeams } from '../../../dataAccess/hooks/public/useGetPublicTeams';
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
  federation: string;
}

export function UserRegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);
  const { mutateAsync, isLoading } = useCreateUser();
  const { data: publicTeams } = useGetPublicTeams();
  const { data: publicFederations } = useGetPublicFederations();

  const [selectedRole, setSelectedRole] = useState<Roles>(Roles.USER);

  async function handleSubmit(data: IForm) {
    formRef.current?.setErrors({});

    if (data.federation && data.team)
      throw new Error('Selecione uma federação ou um time');

    try {
      await validateForm(data, {
        name: Yup.string().required('Nome obrigatório'),
        role: Yup.string().required('RoleAccess obrigatório'),
        team: Yup.string(),
        federation: Yup.string(),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Email inválido'),
        password: Yup.string().required('Senha obrigatória'),
      });

      const team = publicTeams?.list.find(t => t.id === data.team);
      const federation = publicFederations?.list.find(
        f => f.id === data.federation,
      );

      if (team) {
        // @ts-ignore
        await mutateAsync({
          ...data,
          team: {
            id: team!.id,
            name: team!.name,
          },
        });
      }

      if (federation) {
        // @ts-ignore
        await mutateAsync({
          ...data,
          federation: {
            id: federation!.id,
            name: federation!.name,
          },
        });
      }

      toast.success('Usuário criado com sucesso!');

      navigate('/app/usuarios/listagem');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = handleFormErrors(err);

        return formRef.current?.setErrors(errors);
      }

      toast.error('Ops! Não foi possivel criar usuário!');
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
            <Select
              label="AccessRole"
              name="role"
              onChange={e => setSelectedRole(e.target.value as Roles)}
            >
              <option value={Roles.ADMIN}>Admin</option>
              <option value={Roles.ADMINFEDERACAO}>AdminFederacao</option>
              <option value={Roles.ADMINCLUBE}>AdminClube</option>
              <option value={Roles.COMISSAOTECNICA}>ComissaoTecnica</option>
              <option value={Roles.OFICIAL}>Oficial</option>
              <option value={Roles.USER}>Usuario</option>
            </Select>
          </div>
          <div className="flex-1">
            {/* TODO: alterar input para federaçao */}

            {selectedRole === Roles.ADMINFEDERACAO && (
              <Select label="Federação" name="federation">
                <option value="">Selecione uma federação</option>
                {publicFederations &&
                  publicFederations.list &&
                  publicFederations.list.length > 0 &&
                  publicFederations?.list.map(fed => (
                    <option key={fed.id} value={fed.id}>
                      {fed.name}
                    </option>
                  ))}
              </Select>
            )}

            {selectedRole !== Roles.ADMINFEDERACAO && (
              <Select label="Clube" name="team">
                <option value="">Selecione um clube</option>
                {publicTeams &&
                  publicTeams.list &&
                  publicTeams.list.length > 0 &&
                  publicTeams?.list.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </Select>
            )}
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
