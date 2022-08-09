/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext,
  ReactElement,
  useContext,
  useState,
} from 'react';

interface GlobalContextData {
  token: string | undefined;
  setToken(data: string): void;
}

interface IProps {
  children: ReactElement;
}

const GlobalContext = createContext({} as GlobalContextData);

function GlobalProvider({ children }: IProps) {
  const [token, setToken] = useState(
    () => localStorage.getItem('@SIGH:accessToken') || '',
  );

  return (
    <GlobalContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

function useGlobal(): GlobalContextData {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error('useGlobal must be used within an GlobalProvider');
  }

  return context;
}

export { GlobalProvider, useGlobal };
