"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Inputs/Button";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";
import { usePost } from "@/hooks/usePost";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { handleSubmit, register } = useForm<LoginForm>();
  const { mutate, status, error } = usePost("/api/authentication");

  const onSubmit = async (data: LoginForm) => {
    try {
      await mutate(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Faça o login no SIGH ou registre-se
        </p>
        {status === "error" && <Alert message={error!} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textfield
            type="email"
            id="email"
            label="Email"
            {...register("email")}
          />
          <Textfield
            type="password"
            id="password"
            label="Senha"
            {...register("password")}
          />
          <Button type="submit" isLoading={status === "loading"}>
            Entrar
          </Button>
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
