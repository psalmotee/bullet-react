import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserButton from "./UserButton";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

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
        <Spin size="meduim"></Spin>
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
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-medium text-black">Dashboard</h2>
            </div>
            <div className="mt-6">
              <h1 className="text-lg text-black">
                Welcome{" "}
                <span className="font-bold">
                  {userDetails.firstName + " " + userDetails.lastName}
                </span>
              </h1>
              <h4 className="text-lg mt-4 text-black">
                Your role:{" "}
                <span className="font-bold uppercase">
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
    </>
  );
}

export default Dashboard;
