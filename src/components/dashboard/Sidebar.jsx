import reactLogo from "../../assets/react.svg";
import { FiHome } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";


function Sidebar() {
  return (
    <>
      <div className="bg-black w-72 py-9 px-2 h-screen flex flex-col">
        <div className="flex items-center justify-center pl-6">
          <a href="/" className="flex items-center">
            <img src={reactLogo} className="h-6 w-auto" alt="React logo" />
            <span className="text-white mx-3 text-sm">Bulletproof React</span>
          </a>
        </div>
        <ul className="mt-9 font-medium space-y-4">
          <li className="text-white py-2 px-4 rounded hover:bg-gray-700">
            <a href="/dashboard" className="flex items-center">
              <FiHome className="inline-block mr-4 size-6 text-gray-400" />
              Dashboard
            </a>
          </li>
          <li className="text-white py-2 px-4 rounded hover:bg-gray-700">
            <a href="/discussion" className="flex items-center">
              <FiFolder className="inline-block mr-4 size-6 text-gray-400" />
              Discussion
            </a>
          </li>
          <li className="text-white py-2 px-4 rounded hover:bg-gray-700">
            <a href="/users" className="flex items-center">
              <LuUsers className="inline-block mr-4 size-6 text-gray-400" />
              Users
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
