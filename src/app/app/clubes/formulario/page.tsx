"use client";

import { Button } from "@/components/Inputs/Button";
import { FileInput } from "@/components/Inputs/FileInput";
import { Textarea } from "@/components/Inputs/Textarea";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { useMutation } from "@/hooks/useMutation";
import { fetcher } from "@/services/fetcher";
import { uploadFile } from "@/services/uploadFile";
import { NextPage } from "@/types/NextPage";
import { Federation, Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

type FormValues = {
  name: string;
  initials: string;
  email: string;
  url: string;
  presidentName: string;
  beginningOfTerm: string;
  endOfTerm: string;
  coachName: string;
  description: string;
  federationId: string;
};

interface IFiles {
  logo: File | undefined;
  presidentDocument: File | undefined;
  teamDocument: File | undefined;
  electionMinutes: File | undefined;
}

const TeamsFormPage = ({ searchParams }: NextPage) => {
  const id = searchParams?.id as string;

  const router = useRouter();

  const { data: publicFederation, isLoading } = useSWR<
    Array<Pick<Federation, "id" | "name" | "initials">>
  >(`/api/federation/public`, fetcher);

  const { data: selectedFederation, isLoading: isLoadingTeam } = useSWR<Team>(
    id ? `/api/team/${id}` : null,
    fetcher
  );

  const { register, reset, handleSubmit } = useForm<FormValues>();

  const { mutate: create, status: createStatus } = useMutation(
    "/api/team",
    "POST"
  );

  const { mutate: update, status: updateStatus } = useMutation(
    `/api/team/${id}`,
    "PUT"
  );

  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [files, setFiles] = useState<IFiles>({
    logo: undefined,
    presidentDocument: undefined,
    teamDocument: undefined,
    electionMinutes: undefined,
  });

  useEffect(() => {
    if (selectedFederation) {
      reset({
        name: selectedFederation.name,
        initials: selectedFederation.initials,
        email: selectedFederation.email,
        url: selectedFederation.url,
        presidentName: selectedFederation.presidentName,
        beginningOfTerm: selectedFederation.beginningOfTerm,
        endOfTerm: selectedFederation.endOfTerm,
        coachName: selectedFederation.coachName,
        description: selectedFederation.description,
        federationId: selectedFederation.federationId.toString(),
      });
    }
  }, [reset, selectedFederation]);

  const onSubmit = async (data: FormValues) => {
    const { electionMinutes, teamDocument, logo, presidentDocument } = files;

    try {
      if (!id) {
        if (!electionMinutes || !teamDocument || !logo || !presidentDocument) {
          throw new Error("Todos os arquivos são obrigatórios");
        }

        setIsLoadingUpload(true);

        const urls = await Promise.all([
          uploadFile("/sigh/teams", electionMinutes, "electionMinutes"),
          uploadFile("/sigh/teams", teamDocument, "teamDocument"),
          uploadFile("/sigh/teams", logo, "logo"),
          uploadFile("/sigh/teams", presidentDocument, "presidentDocument"),
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
            ? uploadFile("/sigh/teams", electionMinutes, "electionMinutes")
            : null,
          teamDocument
            ? uploadFile("/sigh/teams", teamDocument, "teamDocument")
            : null,
          logo ? uploadFile("/sigh/teams", logo, "logo") : null,
          presidentDocument
            ? uploadFile("/sigh/teams", presidentDocument, "presidentDocument")
            : null,
        ]);

        const filteredUrls = newUrls.filter((url) => url);

        const filesUrl = filteredUrls.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        await update({ ...data, ...filesUrl });
      }

      startTransition(() => {
        router.push("/app/clubes");
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

  if ((id && isLoadingTeam) || isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h2 className="text-3xl text-light-on-surface mb-2">Clube</h2>
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
            <Textfield label="Email" id="email" {...register("email")} />
          </div>
          <div className="col-span-2">
            <Textfield label="Site/Fanpage" id="url" {...register("url")} />
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
        <Textfield
          label="Nome do técnico"
          id="coachName"
          {...register("coachName")}
        />
        <Textarea
          label="Descrição"
          id="description"
          rows={5}
          {...register("description")}
        />
        <Select
          label="Federação"
          id="federationId"
          {...register("federationId")}
        >
          <option value="">Selecione uma federação</option>
          {publicFederation?.map((federation) => (
            <option key={federation.id} value={federation.id}>
              {federation.name}
            </option>
          ))}
        </Select>
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
                setFiles({ ...files, teamDocument: e.target.files?.[0] })
              }
              url={selectedFederation?.teamDocument}
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

export default TeamsFormPage;
