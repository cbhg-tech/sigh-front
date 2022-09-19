import { CgSpinner } from 'react-icons/cg';

export function LoadingScreen() {
  return (
    <div className="bg-light-surface-variant w-screen h-screen text-light-on-surface-variant grid place-items-center">
      <div className="flex flex-col items-center">
        <CgSpinner size="3rem" className="animate-spin" />
        <p>Carregando...</p>
      </div>
    </div>
  );
}
