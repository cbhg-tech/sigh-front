"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { OnBoardingContainer } from "@/components/layouts/OnBoarding.layout";
import { usePost } from "@/hooks/usePost";
import { useForm } from "react-hook-form";

type RegisterForm = {
  name: string;
  email: string;
  document: string;
  birthDate: string;
  team: string;
  password: string;
};

export default function RegisterPage() {
  const { handleSubmit, register } = useForm<RegisterForm>();
  const { mutate, status, error } = usePost("/api/athlete/create");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await mutate({
        ...data,
        teamId: "Palmeiras",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <OnBoardingContainer>
      <div>
        <p className="text-center mb-4 font-medium text-light-on-surface">
          Cadastro de atletas do hóquei brasileiro
        </p>
        {status === "error" && <Alert message={error!} />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Textfield
            type="text"
            id="name"
            label="Nome completo"
            {...register("name")}
          />
          <Textfield
            type="email"
            id="email"
            label="Email"
            {...register("email")}
          />
          <Textfield
            type="text"
            id="document"
            label="CPF"
            {...register("document")}
          />
          <Textfield
            type="date"
            id="birthDate"
            label="Data de nascimento"
            {...register("birthDate")}
          />
          <Select id="team" label="Clube atual" {...register("team")}>
            <option value="">Selecione um clube</option>
          </Select>
          <Textfield
            type="password"
            id="password"
            label="Senha"
            {...register("password")}
          />
          <Button type="submit" isLoading={status === "loading"}>
            Criar conta
          </Button>
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
