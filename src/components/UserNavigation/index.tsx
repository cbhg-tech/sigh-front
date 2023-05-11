"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Aside } from "./Aside";
import { UserComplete } from "@/types/UserComplete";

interface IProps {
  children: React.ReactNode;
  user: UserComplete;
}

export function Navigation({ children, user }: IProps) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  return (
    <div className="grid grid-cols-5 grid-rows-[64px_1fr] overflow-y-hidden w-full h-screen bg-light-surface-1">
      <Header user={user} toogleSideMenu={setIsSideMenuOpen} />
      <Aside
        user={user}
        isMenuOpen={isSideMenuOpen}
        toogleSideMenu={setIsSideMenuOpen}
      />

      <main className="col-span-5 lg:col-span-4 h-full overflow-y-auto">
        <div className=" p-4 bg-light-surface-1 mb-24">
          <div className="bg-light-surface p-6 rounded-2xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
