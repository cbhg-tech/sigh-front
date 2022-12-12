import { useState } from 'react';
import { Header } from './Header';
import { Aside } from './Aside';

interface IProps {
  children: React.ReactNode;
  title: string;
}

export function Navigation({ children, title }: IProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="grid grid-cols-5 grid-rows-[64px_1fr] overflow-y-hidden w-full h-screen bg-light-surface-1">
      <Header toogleSideMenu={setIsSideMenuOpen} title={title} />
      <Aside isOpen={isSideMenuOpen} toogleSideMenu={setIsSideMenuOpen} />
      <main className="col-span-5 lg:col-span-4 h-full overflow-y-auto">
        <div className=" p-4 bg-light-surface-1 mb-24">{children}</div>
      </main>
    </div>
  );
}
