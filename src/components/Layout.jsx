import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow p-6 transition-all ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;