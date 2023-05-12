"use client";

import { UserComplete } from "@/types/UserComplete";
import { Admin, ROLE, USER_STATUS, USER_TYPE } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { Badge } from "./Badge";
import { IconButton } from "./Inputs/IconButton";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { Textfield } from "./Inputs/Textfield";

type RelationsKey = {
  teamId?: string;
  federationId?: string;
};

interface DataListProps {
  user: UserComplete;
  data: any[];
  lineKey: string;
  searchTextKey?: string;
  customEmptyDataMessage?: string;
  tableSettings: Array<{
    name: string;
    width: string;
    key: string;
    formatter?: "ASSOCIATION" | "BADGE" | "STATUS";
    formatterParam?: string | string[];
  }>;
  actions?: Array<{
    type: "DELETE" | "EDIT" | "VIEW";
    redirect?: string;
    deleteUrl?: string;
    blockBy?: "ROLE" | "CREATED_BY";
    roles?: ROLE[];
    relationsKey?: RelationsKey;
  }>;
}

export function DataList({
  user,
  data,
  tableSettings,
  lineKey,
  searchTextKey,
  customEmptyDataMessage,
  actions,
}: DataListProps) {
  const [isLoading, setIsLoading] = useState<number | undefined>();
  const [search, setSearch] = useState<string>("");

  const router = useRouter();

  function getValue<T>(key: string, data: any): T {
    const keys = key.split(".");

    if (keys.length === 1) {
      return data[keys[0]];
    }

    let value = data;

    for (const curr of keys) {
      if (!value) value = "";

      value = value[curr];
    }

    return value;
  }

  function formatAssociation(data: any, formatterParam?: string | string[]) {
    if (formatterParam && typeof formatterParam === "string") {
      return getValue<string>(formatterParam, data);
    } else if (formatterParam) {
      for (const param of formatterParam) {
        const value = getValue<string>(param, data);

        if (value) return value;
      }
    }

    return "CBHG";
  }

  function formatStatus(data: any, formatterParam?: string) {
    const status = getValue<USER_STATUS>(formatterParam!, data);

    switch (status) {
      case USER_STATUS.ACTIVE:
        return "Ativo";
      case USER_STATUS.INACTIVE:
        return "Inativo";
      default:
      case USER_STATUS.PENDING:
        return "Pendente";
    }
  }

  function formatBadge(data: any, formatterParam?: string) {
    const value = getValue<USER_STATUS>(formatterParam!, data);

    return <Badge type="tertiary">{value}</Badge>;
  }

  function formatter(
    formatter: string,
    value: any,
    formatterParam?: string | string[]
  ) {
    switch (formatter) {
      case "ASSOCIATION":
        return formatAssociation(value, formatterParam);
      case "BADGE":
        return formatBadge(value, formatterParam as string);
      case "STATUS":
        return formatStatus(value, formatterParam as string);
      default:
        return value;
    }
  }

  function blockByRole(roles: ROLE[]) {
    if (roles.includes(user.admin?.role as ROLE)) {
      return true;
    }

    return false;
  }

  const blockByRelation = (data: any, relationsKey?: RelationsKey) => {
    if (user?.type === USER_TYPE.ATHLETE) return false;

    const federationId = relationsKey?.federationId
      ? getValue<Admin>(relationsKey?.federationId, data)
      : null;
    const teamId = relationsKey?.teamId
      ? getValue<Admin>(relationsKey?.teamId, data)
      : null;

    if (
      user?.type === USER_TYPE.ADMIN &&
      !teamId &&
      user.admin?.federationId === federationId
    ) {
      return false;
    }

    if (
      user?.type === USER_TYPE.ADMIN &&
      !federationId &&
      user.admin?.teamId === teamId
    ) {
      return false;
    }

    if (
      user?.type === USER_TYPE.ADMIN &&
      !user.admin?.federationId &&
      !user.admin?.teamId &&
      !federationId &&
      !teamId
    ) {
      return false;
    }

    return true;
  };

  function executeBlock(
    data: any,
    type?: string,
    roles?: ROLE[],
    relationsKey?: RelationsKey
  ) {
    if (type === "ROLE" && roles) {
      return blockByRole(roles);
    }

    if (type === "CREATED_BY" && relationsKey) {
      return blockByRelation(data, relationsKey);
    }

    return false;
  }

  const filteredData = data.filter((d) => {
    if (search === "" || !searchTextKey) return d;

    const value = getValue<string>(searchTextKey, d);

    if (value.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      return d;
  });

  return (
    <>
      <div className="grid gap-2 grid-cols-3">
        {searchTextKey && (
          <div>
            <Textfield
              id="search"
              label="Pesquisar..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>
      <div>
        {filteredData.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-light-on-surface-variant font-semibold text-2xl">
              {customEmptyDataMessage ?? "Nenhum dado encontrado"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                {tableSettings.map((header) => (
                  <th
                    className={`${header.width} text-left py-4 px-2 bg-slate-100`}
                    key={header.name}
                  >
                    {header.name}
                  </th>
                ))}
                <th className="w-auto py-4 px-2 bg-slate-100"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr
                  className="border-b last:border-none border-slate-200"
                  key={d[lineKey]}
                >
                  {tableSettings.map((set) => (
                    <td
                      className={`${set.width} py-4 px-2`}
                      key={`${d[lineKey]}-${set.name}`}
                    >
                      {set.formatter
                        ? formatter(set.formatter, d, set.formatterParam)
                        : getValue(set.key, d)}
                    </td>
                  ))}

                  <td className={`w-auto py-4 px-2`}>
                    <div className="flex gap-2 items-center justify-end">
                      {isLoading === d[lineKey] && (
                        <div className="flex gap-2 justify-end">
                          <CgSpinner
                            size="2rem"
                            className="text-light-primary animate-spin"
                          />
                        </div>
                      )}

                      {isLoading !== d[lineKey] &&
                        actions?.map((action) => {
                          if (action.type === "VIEW") {
                            const isBlocked = executeBlock(
                              d,
                              action.blockBy,
                              action.roles,
                              action.relationsKey
                            );

                            if (isBlocked) return null;

                            return (
                              <Link
                                href={`${action.redirect!}${d[lineKey]}`}
                                key="VIEW"
                              >
                                <AiOutlineEye
                                  className="text-light-tertiary"
                                  size="1.5rem"
                                />
                              </Link>
                            );
                          }

                          if (action.type === "EDIT") {
                            const isBlocked = executeBlock(
                              d,
                              action.blockBy,
                              action.roles,
                              action.relationsKey
                            );

                            if (isBlocked) return null;

                            return (
                              <Link
                                href={`${action.redirect!}${d[lineKey]}`}
                                key="EDIT"
                              >
                                <MdEdit
                                  className="text-light-primary"
                                  size="1.5rem"
                                />
                              </Link>
                            );
                          }

                          if (action.type === "DELETE") {
                            const isBlocked = executeBlock(
                              d,
                              action.blockBy,
                              action.roles,
                              action.relationsKey
                            );

                            if (isBlocked) return null;

                            return (
                              <IconButton
                                icon={MdOutlineDeleteOutline}
                                className="text-light-error"
                                size="1.5rem"
                                key="DELETE"
                                onClick={async () => {
                                  setIsLoading(d[lineKey]);

                                  await axios.delete(
                                    `${action.deleteUrl!}${d[lineKey]}`
                                  );

                                  setIsLoading(undefined);

                                  startTransition(() => {
                                    router.refresh();
                                  });
                                }}
                              />
                            );
                          }
                        })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
