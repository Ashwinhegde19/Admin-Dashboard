import { NavLink } from "react-router-dom";
import { LuLayoutDashboard, LuUsers, LuMenu, LuX } from "react-icons/lu";
import { GoPasskeyFill } from "react-icons/go";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard className="w-5 h-5" />, path: "/" },
    { id: "users", label: "Users", icon: <LuUsers className="w-5 h-5" />, path: "/users" },
    { id: "roles", label: "Roles", icon: <GoPasskeyFill className="w-5 h-5" />, path: "/roles" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed md:hidden top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 bg-gray-800 text-white h-screen transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-xl font-semibold">Admin Demo</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;