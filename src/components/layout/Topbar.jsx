import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, PanelLeft } from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex h-14 sm:h-auto items-center justify-between px-4 bg-white border-b border-gray-200 sm:bg-transparent sm:border-none sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center h-9 p- rounded-md border border-gray-200 bg-white hover:bg-gray-50 sm:hidden"
      >
        <span className="sr-only">toggle menu</span>
        <span className="block mx-2">
          <PanelLeft size={20} />
        </span>
      </button>

      {/* Spacer for desktop */}
      <div className="hidden sm:block" />

      {/* Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <UserRound size={24} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-35 bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/dashboard/profile");
              }}
            >
              Your Profile
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 rounded-sm hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
