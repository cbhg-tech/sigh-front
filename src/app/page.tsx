import Link from "next/link";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Inputs/Button";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";
import { NextPage } from "@/types/NextPage";

const errorMsgs = {
  data: "Dados inválidos",
  user: "Usuário não encontrado",
  password: "Senha incorreta",
};

export default function LoginPage({ searchParams }: NextPage) {
  const error = searchParams?.error as keyof typeof errorMsgs;

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Faça o login no SIGH ou registre-se
        </p>

        {error && <Alert message={errorMsgs[error]} />}

        <form action="/api/auth" method="POST">
          <Textfield label="Email" name="email" type="email" id="email" />
          <Textfield
            label="Senha"
            name="password"
            type="password"
            id="password"
          />
          <Button type="submit">Entrar</Button>
        </form>

        <Link
          aria-label="Ainda não tem cadastro? Clique aqui"
          className="p-2 font-medium text-light-surface-tint border border-light-outline rounded-full text-center block"
          href="/cadastro"
        >
          Ainda não tem cadastro?
        </Link>

        <Link
          aria-label="Esqueceu a senha? Clique aqui"
          className="p-2 font-medium text-light-on-surface text-center block"
          href="/esqueceu-senha"
        >
          Esqueceu a senha?
        </Link>
      </div>
    </OnBoardingContainer>
  );
}
