import { Alert } from "@/components/Alert";
import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";
import { NextPage } from "@/types/NextPage";

const maskDocument = (value: string) => {
  if (!value) return "";

  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export default function RegisterPage({ searchParams }: NextPage) {
  const error = searchParams?.error as string;

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Cadastro de atletas do hóquei brasileiro
        </p>
        {error && <Alert message={error!} />}
        <form action="/api/athlete/create" method="post">
          <Textfield type="text" id="name" name="name" label="Nome completo" />
          <Textfield type="email" id="email" name="email" label="Email" />
          <Textfield
            type="text"
            id="document"
            name="document"
            label="CPF"
            onChange={(e) => (e.target.value = maskDocument(e.target.value))}
          />
          <Textfield
            type="date"
            id="birthDate"
            name="birthDate"
            label="Data de nascimento"
          />
          <Select id="team" name="team" label="Clube atual">
            <option value="">Selecione um clube</option>
          </Select>
          <Textfield
            type="password"
            id="password"
            name="password"
            label="Senha"
            min={6}
          />
          <Button type="submit">Criar conta</Button>
        </form>
        <p className="text-xs text-light-on-surface text-center">
          * Caso ainda não tenha um clube e deseja conhecer e praticar este
          esporte, acesse nosso site e saiba como jogar hóquei no Brasil. Saiba
          mais!
        </p>
      </div>
    </OnBoardingContainer>
  );
}
