import Sidebar from "./Sidebar";
import UserButton from "./UserButton";
import { LuPen } from "react-icons/lu";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function ProfilePage() {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  // State to hold user details and loading state
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            console.log("User details fetched:", docSnap.data());
            toast.success("User details fetched successfully.");
          } else {
            console.log("User details not found in database.");
            toast.error("User details not found in database.");
          }
        } catch (error) {
          toast.error("Error fetching user details.", error);
          console.error("Error fetching user details:", error);
        }
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
      }
      setLoading(false);
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black" />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        {/* Or you could redirect to login here */}
        <p>
          No user details available. Login{" "}
          <a href="/login" className="text-blue-500">
            here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-row min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div>
            <UserButton />
          </div>
          <div className="px-16 mt-25">
            <h2 className="text-2xl font-medium text-black">Profile</h2>

            <div className="mt-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center px-6 pt-6 pb-2">
                <h3 className="text-lg font-medium">User Information</h3>
                <button
                  onClick={showDrawer}
                  className="h-8 px-3 gap-3 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
                >
                  <span className="text-blue-500 ml-2">
                    <LuPen size="1rem" color="white" />
                  </span>
                  Update Profile
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
                      Update Profile
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
                        htmlFor="first-name"
                        className="text-md font-semibold"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 "
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="text-md font-semibold"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 "
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-md font-semibold"
                      >
                        Email Address
                      </label>
                      <input
                        type="text"
                        id="email"
                        className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bio"
                        className="text-md font-semibold"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      ></textarea>
                    </div>
                  </div>
                </Drawer>
              </div>
              <p className="text-lg text-sm text-gray-700 px-6 pb-5 border-b border-gray-200">
                Personal details of the user.
              </p>

              <div className="text-sm text-gray-800">
                <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
                  <span className="text-gray-500 font-semibold">
                    First Name
                  </span>
                  <span className="text-gray-900">{userDetails.firstName}</span>
                </div>
                <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
                  <span className="text-gray-500 font-semibold">Last Name</span>
                  <span className="text-gray-900">{userDetails.lastName}</span>
                </div>
                <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
                  <span className="text-gray-500 font-semibold">
                    Email Address
                  </span>
                  <span className="text-gray-900">{userDetails.email}</span>
                </div>
                <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
                  <span className="text-gray-500 font-semibold">Role</span>
                  <span className="text-gray-900">{userDetails.role}</span>
                </div>
                <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
                  <span className="text-gray-500 font-semibold">Bio</span>
                  <span className="text-gray-900">
                    {userDetails.bio || "–"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProfilePage;
