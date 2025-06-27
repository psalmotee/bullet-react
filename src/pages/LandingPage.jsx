import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import reactLogo from "../assets/icons/reactLogo.svg";
import Button from "../components/ui/Button";

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white mx-aut px-4 py-6 sm:p-6">
      <div className="text-center max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Bulletproof React
        </h1>

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={reactLogo}
            className="w-auto"
            alt="React logo"
          />
        </div>

        {/* Subtitle */}
        <p>
          Showcasing Best Practices For Building React Applications
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button
            size="md"
            onClick={() => navigate("/login")}
          >
            <span className="mr-2">
              <BiHome size={24} />
            </span>
            Get Started
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => window.open("http://github.com/psalmotee", "_blank")}
          >
            <span className="mr-2">
              <FaGithub size={24} />
            </span>
            Github Repo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;