"use client";

import { Button } from "@/components/Inputs/Button";
import { FileInput } from "@/components/Inputs/FileInput";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { useMutation } from "@/hooks/useMutation";
import { fetcher } from "@/services/fetcher";
import { NextPage } from "@/types/NextPage";
import { States } from "@/utils/states";
import { uploadFile } from "@/utils/uploadFile";
import { Federation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import LoadingForm from "./loading";

type FormValues = {
  name: string;
  email: string;
  initials: string;
  uf: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
};

interface IFiles {
  logo: File | undefined;
  presidentDocument: File | undefined;
  federationDocument: File | undefined;
  electionMinutes: File | undefined;
}

const FederationFormPage = ({ searchParams }: NextPage) => {
  const id = searchParams?.id as string;

  const router = useRouter();

  const { data: selectedFederation, isLoading } = useSWR<Federation>(
    id ? `/api/federation/${id}` : null,
    fetcher
  );

  const { register, reset, handleSubmit } = useForm<FormValues>();

  const { mutate: create, status: createStatus } = useMutation(
    "/api/federation",
    "POST"
  );

  const { mutate: update, status: updateStatus } = useMutation(
    `/api/federation/${id}`,
    "PUT"
  );

  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [files, setFiles] = useState<IFiles>({
    logo: undefined,
    presidentDocument: undefined,
    federationDocument: undefined,
    electionMinutes: undefined,
  });

  useEffect(() => {
    if (selectedFederation && !isLoading) {
      reset({
        name: selectedFederation.name,
        email: selectedFederation.email,
        initials: selectedFederation.initials,
        uf: selectedFederation.uf,
        presidentName: selectedFederation.presidentName,
        beginningOfTerm: selectedFederation.beginningOfTerm,
        endOfTerm: selectedFederation.endOfTerm,
      });
    }
  }, [isLoading, reset, selectedFederation]);

  const onSubmit = async (data: FormValues) => {
    const { electionMinutes, federationDocument, logo, presidentDocument } =
      files;

    try {
      if (!id) {
        if (
          !electionMinutes ||
          !federationDocument ||
          !logo ||
          !presidentDocument
        ) {
          throw new Error("Todos os arquivos são obrigatórios");
        }

        setIsLoadingUpload(true);

        const urls = await Promise.all([
          uploadFile("/sigh/federation", electionMinutes, "electionMinutes"),
          uploadFile(
            "/sigh/federation",
            federationDocument,
            "federationDocument"
          ),
          uploadFile("/sigh/federation", logo, "logo"),
          uploadFile(
            "/sigh/federation",
            presidentDocument,
            "presidentDocument"
          ),
        ]);

        const filesUrl = urls.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        await create({
          ...data,
          ...filesUrl,
        });
      } else {
        const newUrls = await Promise.all([
          electionMinutes
            ? uploadFile("/sigh/federation", electionMinutes, "electionMinutes")
            : null,
          federationDocument
            ? uploadFile(
              "/sigh/federation",
              federationDocument,
              "federationDocument"
            )
            : null,
          logo ? uploadFile("/sigh/federation", logo, "logo") : null,
          presidentDocument
            ? uploadFile(
              "/sigh/federation",
              presidentDocument,
              "presidentDocument"
            )
            : null,
        ]);

        const filteredUrls = newUrls.filter((url) => url);

        const filesUrl = filteredUrls.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        await update({ ...data, ...filesUrl });
      }

      startTransition(() => {
        router.push("/app/federacoes");
        router.refresh();
      });
    } catch (error) {
      alert(error);
    } finally {
      setIsLoadingUpload(false);
    }
  };

  const isSubmitting =
    createStatus === "loading" || updateStatus === "loading" || isLoadingUpload;

  if (id && isLoading) return <LoadingForm />;

  return (
    <div>
      <h2 className="text-3xl text-light-on-surface mb-2">Federação</h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> Após este cadastro, faça o registro de pelo
        menos um usuário administrador para esta federação.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Textfield label="Nome" id="name" {...register("name")} />
          </div>
          <div className="col-span-1">
            <Textfield label="Sigla" id="initials" {...register("initials")} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <Select label="Estado" id="uf" {...register("uf")}>
              {States.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2">
            <Textfield label="Email" id="email" {...register("email")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="col-span-1">
            <FileInput
              label="Logo da federação"
              id="logo"
              onChange={(e) =>
                setFiles({ ...files, logo: e.target.files?.[0] })
              }
              accept="image/png, image/jpeg, image/jpg"
              url={selectedFederation?.logo}
            />
          </div>
          <div className="col-span-1">
            <FileInput
              label="Anexo status da entidade"
              id="federationFile"
              onChange={(e) =>
                setFiles({ ...files, federationDocument: e.target.files?.[0] })
              }
              url={selectedFederation?.federationDocument}
            />
          </div>
        </div>
        <Textfield
          label="Nome do presidente"
          id="presidentName"
          {...register("presidentName")}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <Textfield
              type="date"
              label="Data de inicio do mandato"
              id="beginningOfTerm"
              {...register("beginningOfTerm")}
            />
          </div>
          <div className="col-span-1">
            <Textfield
              type="date"
              label="Data do fim do mandato"
              id="endOfTerm"
              {...register("endOfTerm")}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="col-span-1">
            <FileInput
              label="Anexo RG do Presidente"
              id="presidentFile"
              onChange={(e) =>
                setFiles({ ...files, presidentDocument: e.target.files?.[0] })
              }
              url={selectedFederation?.presidentDocument}
            />
          </div>
          <div className="col-span-1">
            <FileInput
              label="Anexo Ata da Eleição"
              id="electionFile"
              onChange={(e) =>
                setFiles({ ...files, electionMinutes: e.target.files?.[0] })
              }
              url={selectedFederation?.electionMinutes}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <NavigationButton
            href="/app/federacoes"
            variant="primary-border"
            additionalClasses="w-auto px-2"
          >
            Cancelar
          </NavigationButton>
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
};

export default FederationFormPage;
