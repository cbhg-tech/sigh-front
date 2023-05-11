"use client";

import { UserComplete } from "@/types/UserComplete";
import { Admin, ROLE } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { AiOutlineEye } from "react-icons/ai";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";
import { Badge } from "./Badge";
import { IconButton } from "./Inputs/IconButton";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

interface DataListProps {
  user: UserComplete;
  data: any[];
  lineKey: string;
  tableSettings: Array<{
    name: string;
    width: string;
    key: string;
    formatter?: "ASSOCIATION" | "BADGE";
  }>;
  actions?: Array<{
    type: "DELETE" | "EDIT" | "VIEW";
    redirect?: string;
    deleteUrl?: string;
    blockBy?: "ROLE" | "CREATED_BY";
    roles?: ROLE[];
  }>;
}

export function DataList({
  user,
  data,
  tableSettings,
  lineKey,
  actions,
}: DataListProps) {
  const [isLoading, setIsLoading] = useState<number | undefined>();

  const router = useRouter();

  function formatAssociation(admin: Admin) {
    if (admin?.federationId) {
      // @ts-ignore
      return admin.federation.name;
    }

    if (admin?.teamId) {
      // @ts-ignore
      return admin.team.name;
    }

    return "CBHG";
  }

  function formatter(formatter: string, value: any) {
    switch (formatter) {
      case "ASSOCIATION":
        return formatAssociation(value);
      case "BADGE":
        return <Badge type="tertiary">{value}</Badge>;
      default:
        return value;
    }
  }

  function getValue<T>(key: string, data: any): T {
    const keys = key.split(".");

    if (keys.length === 1) {
      return data[keys[0]];
    }

    let value = data;
    for (const curr of keys) {
      value = value[curr];
    }

    return value;
  }

  function blockByRole(roles: ROLE[]) {
    if (roles.includes(user.admin?.role as ROLE)) {
      return false;
    }

    return true;
  }

  function executeBlock(type?: string, roles?: ROLE[]) {
    if (type === "ROLE" && roles) {
      return blockByRole(roles);
    }

    return false;
  }

  return (
    <>
      {/* TODO: adicionar filtros */}
      <div></div>
      <div>
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
            {data.map((d) => (
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
                      ? formatter(set.formatter, getValue(set.key, d))
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
                            action.blockBy,
                            action.roles!
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
      </div>
    </>
  );
}
