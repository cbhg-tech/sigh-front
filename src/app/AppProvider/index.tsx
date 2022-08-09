import { ReactElement } from 'react';
import { GlobalProvider } from '../../contexts/global.context';

interface IProps {
  children: ReactElement;
}

export function AppProvider({ children }: IProps) {
  return <GlobalProvider>{children}</GlobalProvider>;
}
