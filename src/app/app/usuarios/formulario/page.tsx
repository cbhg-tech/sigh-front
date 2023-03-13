"use client";

import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { useMutation } from "@/hooks/useMutation";
import { fetcher } from "@/services/fetcher";
import { NextPage } from "@/types/NextPage";
import { Admin, Federation, ROLE, Team, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

type AdminUser = User & {
  admin: Admin;
};

type FormValues = {
  name: string;
  email: string;
  role: ROLE;
  related: number | null;
  password: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const FormularioPage = ({ searchParams }: NextPage) => {
  const id = searchParams?.id as string;

  const router = useRouter();

  const { data: selectedUser, isLoading } = useSWR<AdminUser>(
    id ? `/api/user/${id}` : null,
    fetcher
  );

  const { data: teams } = useSWR<Team[]>(`${apiUrl}/api/team/public`, fetcher);
  const { data: federations } = useSWR<Federation[]>(
    `/api/federation/public`,
    fetcher
  );

  const { register, reset, handleSubmit } = useForm<FormValues>();

  const [selectedRole, setSelectedRole] = useState<ROLE>(ROLE.ADMINFEDERATION);

  const { mutate: create, status: createStatus } = useMutation(
    `/api/user`,
    "POST"
  );
  const { mutate: update, status: updateStatus } = useMutation(
    `/api/user/${id}`,
    "PUT"
  );

  useEffect(() => {
    if (selectedUser && !isLoading) {
      reset({
        name: selectedUser.name,
        email: selectedUser.email,
        related:
          selectedUser.admin.federationId || selectedUser.admin.teamId || null,
      });

      setSelectedRole(selectedUser.admin.role);
    }
  }, [isLoading, reset, selectedUser]);

  async function onSubmit(data: FormValues) {
    try {
      if (id) {
        await update({
          name: data.name,
          email: data.email,
          role: selectedRole,
          related: data.related,
        });
      } else {
        await create({
          name: data.name,
          email: data.email,
          password: data.password,
          role: selectedRole,
          related: data.related,
        });
      }

      startTransition(() => {
        router.push("/app/usuarios");
        router.refresh();
      });
    } catch (error) {
      alert("Erro ao salvar usuário");
    }
  }

  const isSubmitting = createStatus === "loading" || updateStatus === "loading";

  return (
    <div>
      <h2 className="text-3xl text-light-on-surface mb-2">
        Usuário administrador do sistema
      </h2>
      <p className="mb-8 text-light-on-surface-variant">
        <strong>Atenção!</strong> Somente faça o cadastro abaixo caso tenha
        certeza do acesso que esteja sendo criado. O usuário terá permissões
        para alterar dados da plataforma de acordo com o seu nível de acesso.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textfield label="Nome" id="name" {...register("name")} />
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <Select
              label="AccessRole"
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as ROLE)}
            >
              <option value={ROLE.ADMIN}>Admin</option>
              <option value={ROLE.ADMINFEDERATION}>Admin Federacao</option>
              <option value={ROLE.ADMINTEAM}>Admin Clube</option>
            </Select>
          </div>
          <div className="flex-1">
            {selectedRole === ROLE.ADMIN && (
              <div className="p-4">
                <p className="text-light-on-surface-variant">
                  CBHG - Administração
                </p>
              </div>
            )}

            {selectedRole === ROLE.ADMINFEDERATION && (
              <Select label="Federação" id="related" {...register("related")}>
                <option value="">Selecione uma federação</option>
                {federations &&
                  federations.length > 0 &&
                  federations?.map((fed) => (
                    <option key={fed.id} value={fed.id}>
                      {fed.name}
                    </option>
                  ))}
              </Select>
            )}

            {selectedRole === ROLE.ADMINTEAM && (
              <Select label="Clube" id="related" {...register("related")}>
                <option value="">Selecione um clube</option>
                {teams &&
                  teams.length > 0 &&
                  teams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </Select>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1">
            <Textfield
              type="email"
              id="email"
              label="Email"
              {...register("email")}
            />
          </div>
          {!id && (
            <div className="flex-1">
              <Textfield
                type="password"
                id="password"
                label="Senha"
                {...register("password")}
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <NavigationButton
            href="/app/usuarios"
            variant="primary-border"
            additionalClasses="w-auto px-2"
          >
            Cancelar
          </NavigationButton>
          <Button
            isLoading={isSubmitting}
            disabled={isSubmitting}
            aditionalClasses="w-auto px-2"
            type="submit"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPage;
