import { useNavigate } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import reactLogo from "../assets/icons/reactLogo.svg";
import Button from "../components/ui/Button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-cente justify-center bg-white mx-auto px-4 py-6 sm:p-6">
      <div className="text-center max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Bulletproof React
        </h2>

        {/* Logo */}
        <div className="flex justify-center">
          <img src={reactLogo} className="w-auto" alt="React logo" />
        </div>

        {/* Subtitle */}
        <p>Showcasing Best Practices For Building React Applications</p>

        {/* Action Buttons */}
        <div className="flex space-x-1 justify-center mt-8">
          <Button size="md" onClick={() => navigate("/login")}>
            <span className="mr-">
              <BiHome size={24} />
            </span>
            <span className="mx-2">Get Started</span>
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              window.open("https://github.com/psalmotee/bullet-react", "_blank")
            }
          >
            <span className="">
              <FaGithub size={24} />
            </span>
            <span className="mx-2">Github Repo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
