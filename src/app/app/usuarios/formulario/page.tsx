"use client";

import { Button } from "@/components/Inputs/Button";
import { Select } from "@/components/Inputs/Select";
import { Textfield } from "@/components/Inputs/Textfield";
import { NavigationButton } from "@/components/NavigationButton";
import { fetcher } from "@/services/fetcher";
import { NextPage } from "@/types/NextPage";
import { Admin, Federation, ROLE, Team, User } from "@prisma/client";
import { useEffect, useState } from "react";
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

const FormularioPage = ({ searchParams }: NextPage) => {
  const id = searchParams?.id as string;

  const { data: selectedUser, isLoading } = useSWR<AdminUser>(
    id ? `http://localhost:3000/api/user/${id}` : null,
    fetcher
  );

  const { data: teams } = useSWR<Team[]>(
    "http://localhost:3000/api/team/public",
    fetcher
  );
  const { data: federations } = useSWR<Federation[]>(
    "http://localhost:3000/api/federation/public",
    fetcher
  );

  const { register, reset } = useForm<FormValues>();

  const [selectedRole, setSelectedRole] = useState<ROLE>(ROLE.ADMINFEDERATION);

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
      <form>
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
          <Button aditionalClasses="w-auto px-2" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPage;
