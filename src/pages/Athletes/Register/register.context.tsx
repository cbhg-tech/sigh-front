/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
  createContext,
  ReactElement,
  useContext,
  useState,
} from 'react';

export interface IAthletesDocuments {
  personalDocument: File | null;
  noc: File | null;
  medicalCertificate: File | null;
  commitmentTerm: File | null;
}

interface AthletesRegisterContextData {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  documents: IAthletesDocuments;
  setDocuments: React.Dispatch<React.SetStateAction<IAthletesDocuments>>;
}

interface IProps {
  children: ReactElement;
}

const GlobalContext = createContext({} as AthletesRegisterContextData);

function AthletesRegisterProvider({ children }: IProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [documents, setDocuments] = useState<IAthletesDocuments>({
    personalDocument: null,
    noc: null,
    medicalCertificate: null,
    commitmentTerm: null,
  });

  return (
    <GlobalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        documents,
        setDocuments,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

function useAthletesRegister(): AthletesRegisterContextData {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      'useAthletesRegister must be used within an AthletesRegisterProvider',
    );
  }

  return context;
}

export { AthletesRegisterProvider, useAthletesRegister };
