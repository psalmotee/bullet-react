"use client";

import reactLogo from "../../assets/react.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiHome, FiFolder } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { Outlet } from "react-router-dom";
import Topbar from "../topbar/Topbar";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "Discussions", icon: <FiFolder />, path: "/dashboard/discussions" },
  { name: "Users", icon: <LuUsers />, path: "/dashboard/users" },
];

function Sidebar({ isDrawerOpen, setIsDrawerOpen }) {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     localStorage.removeItem("user");
  //     navigate("/login");
  //   }, 1000);
  // };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      navigate("/login");
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    } finally {
      setLoading(false);
    }
  };


  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      {/* Menu + Left side Drawer */}
      <div className="drawer sm:drawer-open">
        <input
          id="sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={(e) => setIsDrawerOpen(e.target.checked)}
        />
        <div className="drawer-content flex flex-col">
          {/* Content */}
          <div className="md:py-4 flex flex-col md:gap-4">
            <Topbar toggleDrawer={toggleDrawer} />
            <div className="p-4 sm:p-6">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <button
            htmlFor="sidebar-drawer"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="close sidebar"
            className="drawer-overlay sm:hidden"
          ></button>
          <div className="menu p-6 pt-10 sm:px-2 sm:py-4 bg-black h-full w-3/4 sm:w-60 flex flex-col justify-between border-r border-white">
            {/* Sidebar content here */}
            <div className="absolute top-3 right-3 md:hidden">
              <button
                onClick={() => setIsDrawerOpen(false)}
                htmlFor="sidebar-drawer"
                aria-label="close sidebar"
                className="text-gray-400  hover:text-white transition duration-300 ease-all cursor-pointer"
              >
                <IoIosClose size="1.5rem" />
              </button>
            </div>

            {/* <!-- Body --> */}
            <nav className="">
              <ul className="grid gap-6 sm:gap-4">
                <div className="flex items-center px-4 h-16">
                  <Link className="flex items-center pl-2 sm:pl-6 gap-2">
                    <div className="w-9 px-1">
                      <img
                        src={reactLogo}
                        className="h-8 w-auto"
                        alt="React logo"
                      />
                    </div>
                    <span className="text-white text-sm">
                      Bulletproof React
                    </span>
                  </Link>
                </div>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`flex flex-1 font-medium text-[1rem] items-center p-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span className="mr-4 text-2xl">{link.icon}</span>
                      {link.name}
                    </Link>
                  );
                })}
              </ul>
            </nav>

            {/* <!-- Footer --> */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={loading}
                onClick={handleLogout}
                className="h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
              >
                {loading && (
                  <span className="loading loading-spinner loading-xs text-white/50"></span>
                )}
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
