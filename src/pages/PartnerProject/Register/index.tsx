import { useRef } from 'react';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useNavigate } from 'react-router-dom';

import { Textfield } from '../../../components/Inputs/Textfield';
import { Button } from '../../../components/Inputs/Button';

export function PartnerProjectRegisterPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormHandles>(null);

  return (
    <div className="bg-light-surface p-6 rounded-2xl h-full">
      <h2 className="text-3xl text-light-on-surface mb-4">
        Cadastro de projeto de parceria
      </h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> O projeto criado ficará vinculado a
        instituição da conta do usuário, ou seja, ou ao Clube, ou a uma
        Federação ou a Confederação.
      </p>
      <Form
        ref={formRef}
        onSubmit={data => console.log(data)}
        className="flex flex-col gap-2"
      >
        <div className="flex-1">
          <Textfield label="Nome do projeto" name="name" />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield label="Nome do contato" name="contact.name" />
          </div>
          <div>
            <Textfield label="Telefone de contato" name="contact.phone" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield type="date" label="Data de início" name="initialDate" />
          </div>
          <div>
            <Textfield type="date" label="Data do fim" name="finalDate" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Percentual masculino"
              name="malePractitioners"
            />
          </div>
          <div>
            <Textfield
              type="number"
              label="Percentual feminino"
              name="femalePractitioners"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Total de participantes"
              name="practitioners"
            />
          </div>
          <div>
            <Textfield
              label="Faixa Etária"
              hint="Exemplo: Entre 10 e 15 anos"
              name="practitioners"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            label="Cancelar"
            variant="primary-border"
            type="button"
            onClick={() => navigate('/app/tecnico/listagem')}
          />
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            label="Salvar"
            // isLoading={isLoading}
            // disabled={isLoading}
          />
        </div>
      </Form>
    </div>
  );
}
