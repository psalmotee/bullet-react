import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Menu } from "lucide-react";

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
    <div className="flex h-16 items-center justify-between px-4 bg-white border-b border-gray-200 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center p-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <User size={18} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate("/dashboard/profile");
              }}
            >
              Your Profile
            </button>
            <hr className="my-1 border-gray-200" />
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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