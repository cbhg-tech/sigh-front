"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Button } from "@/components/Inputs/Button";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";
import { useForm } from "react-hook-form";
import { auth } from "@/services/firebase-client";
import { useRouter } from "next/navigation";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const token = await res.user.getIdToken();

      // TODO: melhorar segurança disso
      const cookie = `access_token=${token};`;
      document.cookie = cookie;

      router.push("/app/dashboard");
    } catch (error) {
      console.error("An unexpected error happened:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Faça o login no SIGH ou registre-se
        </p>

        <form onSubmit={handleSubmit((d) => onSubmit(d))}>
          <Textfield
            label="Email"
            type="email"
            id="email"
            {...register("email")}
          />
          <Textfield
            label="Senha"
            type="password"
            id="password"
            {...register("password")}
          />
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
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
