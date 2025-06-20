import { useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { LuPanelLeft } from "react-icons/lu";
import ProfilePhotoUpload from "../profile/ProfilePhotoUpload";
import { useState } from "react"
import { useEffect } from "react";


function Topbar({ toggleDrawer }) {
  const [photoURL, setPhotoURL] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, []);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
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
        <div className="">
          <button
            className="flex items-center justify-center rounded-full border border-gray-200 bg-white cursor-pointer p-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 size-9"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" }}
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <LuUserRound size="1.2rem" />
            )}
          </button>

          <ul
            className="dropdown  dropdown-bottom dropdown-end menu w-35 rounded-md bg-base-100 shadow-sm border border-white/5 text-sm transition-all duration-200"
            popover="auto"
            id="popover-1"
            style={{ positionAnchor: "--anchor-1" }}
          >
            <li className="hover:bg-blue-200 rounded-md transition-all duration-200">
              <a onClick={() => navigate("/dashboard/profile")}>Your Profile</a>
            </li>
            <hr className="my-1 border-gray-200" />

            <li className="hover:bg-blue-200 rounded-md transition-all duration-200">
              <a onClick={handleLogout}>Sign Out</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Topbar;
