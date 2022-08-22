import { Form } from '@unform/web';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Inputs/Button';
import { Select } from '../../../components/Inputs/Select';
import { Textfield } from '../../../components/Inputs/Textfield';

export function UserRegisterPage() {
  const navigate = useNavigate();
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
      <Form onSubmit={data => console.log(data)}>
        <Textfield label="Nome" name="name" />
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <Select label="AccessRole" name="role">
              <option value="1">Admin</option>
              <option value="2">AdminFederacao</option>
              <option value="3">AdminClube</option>
              <option value="4">ComissaoTecnica</option>
              <option value="5">Oficial</option>
              <option value="6">Usuario</option>
            </Select>
          </div>
          <div className="flex-1">
            <Select label="Clube" name="team">
              <option value="1">CBHG - Administradores</option>
              <option value="2">AABB - Canoas/RS</option>
              <option value="3">AABB/ São Leopoldo</option>
              <option value="4">Deodoro Hoquei Clube</option>
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
            label="Criar usuário"
          />
        </div>
      </Form>
    </div>
  );
}
