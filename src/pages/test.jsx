import React from "react";
import { useNavigate } from "react-router-dom";
import { LuUserRound } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { LuPanelLeft } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiFolder } from "react-icons/fi";
import { HiMiniPlus } from "react-icons/hi2";
import { CloseOutlined } from "@ant-design/icons";

import { LuUsers } from "react-icons/lu";
import reactLogo from "../assets/react.svg";
import UserButton from "../notUsed/dashboard/UserButton";
import { LuArchiveX, LuCircleAlert } from "react-icons/lu";

const navLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "creates", icon: <FiFolder />, path: "/dashboard/creates" },
  { name: "Users", icon: <LuUsers />, path: "/dashboard/users" },
];

const Test = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileOpenDrawer = () => {
    document.getElementById("update-profile-drawer").checked = true;
  };

  const handleProfileCloseDrawer = () => {
    document.getElementById("update-profile-drawer").checked = false;
  };

  return (
    <>
      <div>
        {/* Create Comment Button + Right side Drawer */}
        <div className="drawer drawer-end flex justify-end">
          <input
            id="update-profile-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-content">
            {/* Page content here */}
            <button
              htmlFor="update-profile-drawer"
              onClick={handleProfileOpenDrawer}
              className="btn drawer-button  h-8 px-3 gap-4 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all"
            >
              <span className="">
                <LuPen size="1.13rem" color="white" />
              </span>
              <span>Update Profile</span>
            </button>
          </div>
          <div className="drawer-side">
            <button
              htmlFor="sidebar-drawer"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="close sidebar"
              className="drawer-overlay"
            ></button>

            <div className="menu py-6 pl-6 pr-2 w-3/4 sm:max-w-[525px] max-w-[800px] min-h-full bg-base-200 text-base-content flex flex-col justify-between">
              {/* Close Button */}
              <div className="absolute top-3 right-[-4px]">
                <button
                  onClick={handleProfileCloseDrawer}
                  htmlFor="update-profile-drawer"
                  aria-label="Close"
                  className="text-gray-500 hover:text-black transition duration-300 ease-in-out cursor-pointer"
                >
                  <IoIosClose size="1.5rem" />
                </button>
              </div>

              <div>
                {/* <!-- Header --> */}
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-black">
                    Update Profile
                  </h2>
                </div>

                {/* <!-- Body --> */}
                <div className="flex- flex-col">
                  <form action="">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
              {/* <!-- Footer --> */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleProfileCloseDrawer}
                  htmlFor="update-profile-drawer"
                  className="btn h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  onClick={handleUpdateProfile}
                  className="btn h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out"
                >
                  {updating && (
                    <span className="loading loading-spinner loading-xs text-white/50"></span>
                  )}
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            open modal
          </button>
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <div className="modal-action absolute top-[-12px] right-3">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  htmlFor="sidebar-drawer"
                  aria-label="close sidebar"
                  className="text-gray-400  hover:text-white transition duration-300 ease-all cursor-pointer"
                >
                  <IoIosClose size="1.6rem" />
                </button>
              </div>

              <div className="flex items-center">
                <span className="inline-block mr-2 text-red-600">
                  <LuCircleAlert size="1.5rem" />
                </span>
                <h2 className="text-lg font-semibold">Delete create</h2>
              </div>
              <p className="px-6 pt-6 pb-2 text-[16px]">
                Are you sure you want to delete this create?
              </p>

              <div className="flex justify-end gap-2 mb-1 mt-2 pr-2">
                <button
                  // onClick={handleDeletecreate}
                  // disabled={deleteLoading}
                  className="h-9 px-5 bg-red-500 text-white rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-red-400 transition ease-all duration-300 cursor-pointer"
                >
                  <span className="loading loading-spinner loading-xs text-white/50"></span>
                  Delete Comment
                </button>

                <button
                  // onClick={handleCancel}
                  className="h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button></button>
            </form>
          </dialog>
        </div>
      </div>
    </>
  );
};
export default Test;
