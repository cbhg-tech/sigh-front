"use client";

import { Button } from "@/components/Inputs/Button";
import { FileInput } from "@/components/Inputs/FileInput";
import { Select } from "@/components/Inputs/Select";
import { Textarea } from "@/components/Inputs/Textarea";
import { Textfield } from "@/components/Inputs/Textfield";
import { useMutation } from "@/hooks/useMutation";
import { formatPhone } from "@/utils/formatPhone";
import { uploadFile } from "@/utils/uploadFile";
import { TECHNICIAN_TYPE } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

export interface IForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  charge: string;
  birthDate: string;
  document?: File;
}

export default function TechnicalOfficerForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IForm>();

  const [document, setDocument] = useState<File | undefined>();

  const { mutate: create, status: createStatus } = useMutation(
    "/api/technician",
    "POST"
  );

  const onSubmit = async (data: IForm) => {
    try {
      if (!document) throw new Error("É necessário enviar um documento");

      const url = await uploadFile(
        "/sigh/technicians",
        document,
        "technicianDocument"
      );

      await create({
        ...data,
        phone: data.phone.replace(/\D/g, ""),
        documentFile: url.technicianDocument,
        type: TECHNICIAN_TYPE.OFFICIAL,
      });

      startTransition(() => {
        router.push("/app/oficiais-tecnicos");
        router.refresh();
      });
    } catch (error) {
      alert(error);
    }
  };

  const isLoading = createStatus === "loading";

  return (
    <div>
      <h2 className="text-3xl text-light-on-surface mb-4">
        Cadastro de oficial técnico
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex-1">
          <Textfield id="name" label="Nome" {...register("name")} />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield
              id="phone"
              label="Telefone"
              {...register("phone", {
                onChange: (e) => {
                  e.target.value = formatPhone(e.target.value);
                },
              })}
            />
          </div>
          <div className="col-span-1">
            <Textfield
              type="date"
              id="birthDate"
              label="Data de nascimento"
              {...register("birthDate")}
            />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield
              type="email"
              id="email"
              label="Email"
              {...register("email")}
            />
          </div>
          <div className="col-span-1">
            <Select id="gender" label="Sexo*" {...register("gender")}>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </Select>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <Textfield
              id="document"
              label="Número do documento"
              {...register("document")}
            />
          </div>
          <div>
            <Textfield id="charge" label="Cargo" {...register("charge")} />
          </div>
        </div>
        <div>
          <Textarea id="address" label="Endereço" />
        </div>
        <div className="p-4">
          <FileInput
            id="document"
            label="Documento de identificação (RG ou CNH)"
            hint="Obrigatório para todos"
            onChange={(e) => setDocument(e.target.files?.[0] || undefined)}
          />
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
            isLoading={isLoading}
            disabled={isLoading}
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
