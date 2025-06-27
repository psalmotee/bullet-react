import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, Users, X } from "lucide-react";
import { useAuthActions } from "../../hooks/useAuth";
import reactLogo from "../../assets/icons/reactLogo.svg";
import Button from "../ui/Button";

const navLinks = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Discussions", icon: MessageSquare, path: "/dashboard/discussions" },
  { name: "Users", icon: Users, path: "/dashboard/users" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { signOut, loading } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 sm:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-3/4 sm:w-60 p-6 pt-10 sm:px-2 sm:py-4 border-r border-white bg-black text-white transform transition-transform duration-300 ease-in-out z-50
        sm:translate-x-0 sm:static sm:z-auto
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full gap-4">
          {/* Close button for mobile */}
          <div className="flex items-center justify-center px-4 h-16">
            <Link to="/" className="flex items-center">
              <img src={reactLogo} className="h-8 w-auto" alt="React logo" />
              <span className="text-sm font-medium">Bulletproof React</span>
            </Link>
            <div className="absolute top-3 right-4 sm:hidden">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="sm:space-y-4 space-y-6">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;

                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 p-2 rounded-md text-md font-medium transition-colors
                        ${
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        size={25}
                        className="text-gray-400 hover:text-gray-300 mr-1"
                      />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              loading={loading}
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