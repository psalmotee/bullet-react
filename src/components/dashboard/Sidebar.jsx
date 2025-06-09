"use client";

import reactLogo from "../../assets/react.svg";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFolder } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";

const navLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "Discussions", icon: <FiFolder />, path: "/dashboard/discussions" },
  { name: "Users", icon: <LuUsers />, path: "/dashboard/users" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <>
      <div className="bg-black min-w-60 min-h-screen  py-9 flex flex-col">
        <div className="flex items-center justify-center ml-4">
          <a href="/" className="flex items-center">
            <img src={reactLogo} className="h-6 w-auto" alt="React logo" />
            <span className="text-white mx-2 text-sm">Bulletproof React</span>
          </a>
        </div>

        <nav className="mt-9 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
              key={link.name}
              to={link.path}
              className={`flex items-center px-4 py-2 rounded transition-colors ${
                isActive
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:bg-gray-500 hover:text-white"
              }`}
              >
              <span className="mr-3 text-2xl">{link.icon}</span>
              {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
