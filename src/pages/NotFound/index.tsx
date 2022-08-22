import { useNavigate } from 'react-router-dom';
import CBHGLogo from '../../assets/cbhg-logo.png';
import { Button } from '../../components/Inputs/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="max-w-xs w-full">
        <img src={CBHGLogo} alt="Logo da CBHG" />
        <h1 className="my-4 text-center text-3xl">
          404 - Página não encontrada
        </h1>
        <Button
          onClick={() => navigate('/')}
          type="button"
          label="Clique aqui para voltar pro login"
        />
      </div>
    </div>
  );
}
