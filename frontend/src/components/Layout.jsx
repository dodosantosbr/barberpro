import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-zinc-950 min-h-screen text-white">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col">
        <TopNav setIsOpen={setIsOpen} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
