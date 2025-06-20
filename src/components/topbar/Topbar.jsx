import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { LuPanelLeft } from "react-icons/lu";

function Topbar({ toggleDrawer }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="flex h-14 sm:h-auto px-4 sm:px-6 items-center justify-between sm:bg-transparent bg-white border-b border-gray-200 sm:border-none  sm:justify-end">
      <div className="block sm:hidden">
        <button
          onClick={toggleDrawer}
          className="flex items-center justify-center rounded-md border border-gray-200 p-2 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <LuPanelLeft size="1.2rem" />
        </button>
      </div>

      {/* Profile button */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center justify-center rounded-full border border-gray-200 bg-white cursor-pointer p-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 size-9"
          onClick={() => setOpen((prev) => !prev)}
        >
          <LuUserRound className="size-6" />
        </button>

        {open && (
          <ul
            className="absolute right-0 mt-2 z-10 dropdown dropdown-bottom dropdown-end menu w-35 rounded-md bg-base-100 shadow-sm border border-white/5 text-sm transition-all duration-200"
          >
            <li
              className="hover:bg-blue-200 rounded-md transition-all duration-200"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard/profile");
              }}
            >
              <a>Your Profile</a>
            </li>
            <hr className="my-1 border-gray-200" />
            <li
              className="hover:bg-blue-200 rounded-md transition-all duration-200"
              onClick={handleLogout}
            >
              <a>Sign Out</a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Topbar;
