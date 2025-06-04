import UserButton from "./UserButton";
import Sidebar from "./Sidebar";
import React, { useState } from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { HiMiniPlus } from "react-icons/hi2";

function Discussions() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="flex flex-row min-h-screen">
        {/* Sidebar component */}
        <Sidebar />

        <div className="flex flex-col w-full">
          <div>
            {/* Profile button component */}
            <UserButton />
          </div>
          <div>
            {/* Discussions component */}
            <div className="px-16 mt-25">
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-medium text-black">Discussions</h2>
              </div>
              <div>
                <div className="flex justify-end">
                  <button
                    onClick={showDrawer}
                    className="mt-3 h-8 px-3 gap-3 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
                  >
                    <span className="text-blue-500 ml-2">
                      <HiMiniPlus size="1.3rem" color="white" />
                    </span>
                    Create Discussion
                  </button>

                  <Drawer
                    placement="right"
                    width={540}
                    onClose={onClose}
                    open={open}
                    closable={false}
                    headerStyle={{ paddingBottom: 0, borderBottom: "none" }}
                    bodyStyle={{ padding: "12px 18px 0px 24px" }}
                    footerStyle={{ borderTop: "none" }}
                    footer={
                      <div className="flex justify-end gap-3 mb-3 pr-2 pb-1">
                        <button
                          type="button"
                          onClick={onClose}
                          className="h-9 px-5 py-2 bg-white text-black rounded-md text-sm font-semibold flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition duration-300 ease-all cursor-pointer"
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="h-9 px-5 py-2 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    }
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h2 className="text-lg font-medium text-black mt-3">
                        Create Discussion
                      </h2>
                      <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-500 cursor-pointer hover:text-black transition"
                      >
                        <CloseOutlined style={{ fontSize: "12px" }} />
                      </button>
                    </div>

                    <div className="flex flex-col gap-6 pr-2">
                      <div>
                        <label
                          htmlFor="discussion-title"
                          className="text-md font-semibold"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="discussion-title"
                          className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 "
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="discussion-content"
                          className="text-sm font-medium"
                        >
                          Body
                        </label>
                        <textarea
                          id="discussion-content"
                          className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                        ></textarea>
                      </div>
                    </div>
                  </Drawer>
                </div>
                <div className="mt-4 bg-white shadow-md rounded-lg flex justify-center items-center w-full h-85">
                  <div className="flex flex-col items-center">
                    <HiOutlineArchiveBoxXMark size="4rem" color="gray" />
                    <h4 className="text-gray-500 text-lg">No Entries Found</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Discussions;
