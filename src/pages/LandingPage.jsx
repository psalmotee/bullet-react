import reactLogo from "@/assets/react.svg";
import { BiHome } from "react-icons/bi";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-4xl font-extrabold text-black">
          Bulletproof React
        </h2>
        <img src={reactLogo} className="h-55 mt-8" alt="React logo" />
        <p className="text-gray-900 mt-8">
          Showcasing Best Practices For Building React Applications
        </p>
        <div className="flex lg:flex-row space-x-3 items-center">
          <button
            type="button"
            className="mt-8 h-9 px-4 py-2 bg-gray-900 font-semibold text-sm text-white rounded-md flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            <span className="flex items-center inline-block mr-4">
              <BiHome size="24" />
            </span>
            Get Started
          </button>
          <div className="mt-8 h-9 px-4 py-2 bg-white text-black rounded-md text-sm font-semibold flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition duration-300 ease-all cursor-pointer">
            <a
              href="http://github.com/psalmotee"
              target="_blank"
              className="flex items-center"
            >
              <span className="inline-block mr-4">
                <FaGithub size="24" />
              </span>
              Github Repo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
