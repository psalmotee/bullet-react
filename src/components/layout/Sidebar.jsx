import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, MessageSquare, Users, X } from "lucide-react";
import { auth } from "../../firebase/firebase";
import { toast } from "react-toastify";
import reactLogo from "../../assets/react.svg";
import Button from "../ui/Button";

const navLinks = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Discussions", icon: MessageSquare, path: "/dashboard/discussions" },
  { name: "Users", icon: Users, path: "/dashboard/users" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-8 lg:justify-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src={reactLogo} className="h-8 w-auto" alt="React logo" />
              <span className="text-sm font-medium">Bulletproof React</span>
            </Link>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="mt-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              loading={loading}
              className="w-full bg-gray-900 text-white hover:bg-gray-700 border-gray-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;