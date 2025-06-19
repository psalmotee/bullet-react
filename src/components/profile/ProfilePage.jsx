import { LuPen } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("User not authenticated.");

    setUpdating(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { firstName, lastName, email, bio });

      toast.success("Profile updated successfully!");
      setUserDetails((prev) => ({ ...prev, firstName, lastName, email, bio }));
      document.getElementById("update-profile-drawer").checked = false;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setEmail(data.email || "");
            setBio(data.bio || "");
            toast.success("User details fetched successfully.");
          } else {
            toast.error("User details not found in database.");
          }
        } catch (error) {
          toast.error("Error fetching user details.");
          console.error("Error fetching user details:", error);
        }
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  // Drawer control for profile update
  const handleProfileOpenDrawer = () => {
    document.getElementById("update-profile-drawer").checked = true;
  };

  const handleProfileCloseDrawer = () => {
    document.getElementById("update-profile-drawer").checked = false;
  };

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
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
    <div className="flex flex-col w-full py-6 sm:py-0">
      <div className="px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-medium text-black">Profile</h2>
      </div>
      <div className="px-4 sm:px-6 md:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="text-sm text-gray-800">
            <div className="grid border-b border-gray-200 px-4 md:px-6 py-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">User Information</h3>
                </div>
                <div>
                  <button
                    htmlFor="update-profile-drawer"
                    onClick={handleProfileOpenDrawer}
                    className="btn drawer-button h-8 px-3 gap-4 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all"
                  >
                    <span className="">
                      <LuPen size="1.13rem" color="white" />
                    </span>
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>

              {/* Update Profile Drawer */}
              <div className="drawer drawer-end">
                <input
                  id="update-profile-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">{/* Page content here */}</div>
                <div className="drawer-side">
                  <button
                    onClick={handleProfileCloseDrawer}
                    htmlFor="update-profile-drawer"
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
                            <label
                              htmlFor="email"
                              className="text-sm font-medium"
                            >
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
                            <label
                              htmlFor="bio"
                              className="text-sm font-medium"
                            >
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

              <p className="text-sm text-gray-500 mt-1">
                Personal details of the user.
              </p>
            </div>
            <div className="px-4 py-5 sm:p-0">
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">First Name</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.firstName}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Last Name</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.lastName}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">
                  Email Address
                </span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.email}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 gap-4 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Role</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.role}
                </span>
              </div>
              <div className="grid sm:grid-cols-3  sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Bio</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.bio || "–"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
