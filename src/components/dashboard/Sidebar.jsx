"use client";

import reactLogo from "../../assets/react.svg";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFolder } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";

const navLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "Discussion", icon: <FiFolder />, path: "/dashboard/discussion" },
  { name: "Users", icon: <LuUsers />, path: "/dashboard/users" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <>
      <div className="bg-black w-60 py-9 px-2 h-full flex flex-col">
        <div className="flex items-center justify-center pl-6">
          <a href="/" className="flex items-center">
            <img src={reactLogo} className="h-6 w-auto" alt="React logo" />
            <span className="text-white mx-3 text-sm">Bulletproof React</span>
          </a>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
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
