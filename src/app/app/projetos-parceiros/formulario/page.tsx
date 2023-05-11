"use client";

import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textarea } from "@/components/Inputs/Textarea";
import { Textfield } from "@/components/Inputs/Textfield";
import { useMutation } from "@/hooks/useMutation";
import { fetcher } from "@/services/fetcher";
import { NextPage } from "@/types/NextPage";
import { States } from "@/utils/states";
import { PartnerProject } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface IForm {
  name: string;
  initialDate: string;
  finalDate: string;
  contactName: string;
  contactPhone: string;
  practitioners: number;
  malePractitioners: number;
  femalePractitioners: number;
  ageGroup: string;
  description: string;
  city: string;
  state: string;
  place: string;
}

function PartnerProjectsForm({ searchParams }: NextPage) {
  const id = searchParams?.id as string;

  const router = useRouter();

  const { data: selectedPartnerProject, isLoading } = useSWR<PartnerProject>(
    id ? `/api/partner-project/${id}` : null,
    fetcher
  );

  const { mutate: create, status: createStatus } = useMutation(
    "/api/partner-project",
    "POST"
  );
  const { mutate: update, status: updateStatus } = useMutation(
    `/api/partner-project/${id}`,
    "PUT"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>();

  useEffect(() => {
    if (id && selectedPartnerProject) {
      reset({
        ...selectedPartnerProject,
      });
    }
  }, [id, reset, selectedPartnerProject]);

  const onSubmit = async (data: IForm) => {
    try {
      if (id) {
        await update(data);
      } else {
        await create(data);
      }

      startTransition(() => {
        router.push("/app/projetos-parceiros");
        router.refresh();
      });
    } catch (error) {
      alert("Erro ao cadastrar projeto de parceria");
    }
  };

  const isSubmitting = createStatus === "loading" || updateStatus === "loading";

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
        noValidate
      >
        <div className="flex-1">
          <Textfield label="Nome do projeto" id="name" {...register("name")} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              label="Nome do contato"
              id="contact.name"
              {...register("contactName")}
            />
          </div>
          <div>
            <Textfield
              label="Telefone de contato"
              id="contact.phone"
              {...register("contactPhone")}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="date"
              label="Data de início"
              id="initialDate"
              {...register("initialDate")}
            />
          </div>
          <div>
            <Textfield
              type="date"
              label="Data do fim"
              id="finalDate"
              {...register("finalDate")}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Percentual masculino"
              id="malePractitioners"
              {...register("malePractitioners", {
                max: {
                  value: 100,
                  message: "O percentual masculino não pode ser maior que 100%",
                },
                min: {
                  value: 0,
                  message: "O percentual masculino não pode ser menor que 0%",
                },
              })}
              error={errors.malePractitioners?.message}
            />
          </div>
          <div>
            <Textfield
              type="number"
              label="Percentual feminino"
              id="femalePractitioners"
              {...register("femalePractitioners", {
                max: {
                  value: 100,
                  message: "O percentual feminino não pode ser maior que 100%",
                },
                min: {
                  value: 0,
                  message: "O percentual feminino não pode ser menor que 0%",
                },
              })}
              error={errors.femalePractitioners?.message}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              type="number"
              label="Total de participantes"
              id="practitioners"
              {...register("practitioners")}
            />
          </div>
          <div>
            <Textfield
              label="Faixa Etária"
              hint="Exemplo: Entre 10 e 15 anos"
              id="ageGroup"
              {...register("ageGroup")}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div>
            <Select label="Estado" id="address.state" {...register("state")}>
              <option value="">UF</option>
              {States.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Textfield label="Cidade" id="address.city" {...register("city")} />
          </div>
          <div>
            <Textfield
              label="Local das atividades"
              id="address.place"
              {...register("place")}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1">
          <div>
            <Textarea
              label="Detalhes do projeto"
              id="description"
              {...register("description")}
            />
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
          <Button
            aditionalClasses="w-auto px-2"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PartnerProjectsForm;
