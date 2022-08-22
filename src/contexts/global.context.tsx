/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext,
  ReactElement,
  useContext,
  useState,
} from 'react';

interface GlobalContextData {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
  children: ReactElement;
}

const GlobalContext = createContext({} as GlobalContextData);

function GlobalProvider({ children }: IProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
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
