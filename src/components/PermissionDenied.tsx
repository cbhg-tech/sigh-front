import Link from "next/link";

export function PermissionDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl text-light-on-surface">Acesso negado</h2>
      <p className="text-light-on-surface">
        Você não tem permissão para acessar essa página
      </p>
      <Link
        className="text-light-on-tertiary-container font-bold underline"
        href="/app/dashboard"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
}
