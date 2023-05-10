"use client";

import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textarea } from "@/components/Inputs/Textarea";
import { Textfield } from "@/components/Inputs/Textfield";
import { States } from "@/utils/states";

interface IForm {
  name: string;
  initialDate: string;
  finalDate: string;
  contact: {
    name: string;
    phone: string;
  };
  practitioners: number;
  malePractitioners: number;
  femalePractitioners: number;
  ageGroup: string;
  description: string;
  address: {
    city: string;
    state: string;
    place: string;
  };
}

function PartnerProjectsForm() {
  return (
    <div>
      <h2 className="text-3xl text-light-on-surface mb-4">
        Cadastro de projeto de parceria
      </h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> O projeto criado ficará vinculado a
        instituição da conta do usuário, ou seja, ou ao Clube, ou a uma
        Federação ou a Confederação.
      </p>
      <form className="flex flex-col gap-2">
        <div className="flex-1">
          <Textfield label="Nome do projeto" id="name" />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield label="Nome do contato" id="contact.name" />
          </div>
          <div>
            <Textfield label="Telefone de contato" id="contact.phone" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield type="date" label="Data de início" id="initialDate" />
          </div>
          <div>
            <Textfield type="date" label="Data do fim" id="finalDate" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Percentual masculino"
              id="malePractitioners"
            />
          </div>
          <div>
            <Textfield
              type="number"
              label="Percentual feminino"
              id="femalePractitioners"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Total de participantes"
              id="practitioners"
            />
          </div>
          <div>
            <Textfield
              label="Faixa Etária"
              hint="Exemplo: Entre 10 e 15 anos"
              id="ageGroup"
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div>
            <Select label="Estado" id="address.state">
              {States.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Textfield label="Cidade" id="address.city" />
          </div>
          <div>
            <Textfield label="Local das atividades" id="address.place" />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1">
          <div>
            <Textarea label="Detalhes do projeto" id="description" />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            aditionalClasses="w-auto px-2 text-light-on-surface-variant"
            variant="primary-border"
            type="button"
          >
            Cancelar
          </Button>
          <Button aditionalClasses="w-auto px-2" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PartnerProjectsForm;
