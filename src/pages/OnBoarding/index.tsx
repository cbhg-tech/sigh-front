import { ReactElement } from 'react';
import CBHGLogo from '../../assets/cbhg-logo.png';

interface IProps {
  children: ReactElement;
}

export function OnBoardingContainer({ children }: IProps) {
  return (
    <div className="flex items-stretch h-screen overflow-hidden">
      <div className="flex flex-col justify-between w-full lg:max-w-2xl overflow-y-auto bg-light-background">
        <div className="mt-12">
          <img src={CBHGLogo} alt="Logo da CBHG" className="w-56 mx-auto" />
        </div>

        <div className="max-w-sm mx-auto w-full p-4">{children}</div>
        <div className="h-16 p-6">
          <p className="text-center text-xs text-light-on-surface-variant">
            Sistema Integrado de Gerenciamento do Hóquei (SIGH)
          </p>
        </div>
      </div>
      <div className="flex-1 hidden bg-center bg-no-repeat bg-cover lg:block bg-on-boarding" />
    </div>
  );
}
