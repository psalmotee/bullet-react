import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserButton from "./UserButton";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify"; // make sure react-toastify is installed

function Dashboard() {
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
          } else {
            toast.error("User details not found in database.");
          }
        } catch (error) {
          toast.error("Error fetching user details.");
          console.error(error);
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
        No user details available.
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div>
          <UserButton />
        </div>
        <div className="px-16 mt-25">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-medium text-black">Dashboard</h2>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl text-black">
              Welcome{" "}
              <span className="font-semibold italic">
                {auth.currentUser?.email}
              </span>
            </h2>
            <h4 className="text-lg mt-4 text-black">
              Your role:{" "}
              <span className="font-semibold">
                {userDetails.role}
                {userDetails.teamName && (
                  <>
                    {" "}
                    of Team{" "}
                    <span className="underline">{userDetails.teamName}</span>
                  </>
                )}
              </span>
            </h4>
            <p className="font-semibold mt-4 text-black">
              In this application you can:
            </p>
            <ul className="list-disc list-inside mt-4">
              <li>Create discussions</li>
              <li>Edit discussions</li>
              <li>Delete discussions</li>
              <li>Comment on discussions</li>
              <li>Delete all comments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
