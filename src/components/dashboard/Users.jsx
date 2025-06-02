import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";
import UserButton from "./UserButton";

function Users() {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("User state changed:", user);
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            console.log("User details fetched:", docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.log("No user is signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {userDetails ? (
        <div className="flex flex-row min-h-screen">
          <Sidebar />

          <div className="flex flex-col w-full">
            <div>
              <UserButton />
            </div>
            <div className="px-16 mt-25">
              <div className="w-full max-w-md">
                <h2 className="text-2xl font-medium text-black">Users</h2>
              </div>
              <div className="mt-6 w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-400">
                      <th className="px-2 h-10 font-medium text-left">
                        First Name
                      </th>
                      <th className="h-10 font-medium px-2 text-left">
                        Last Name
                      </th>
                      <th className="h-10 font-medium px-2 text-left">Email</th>
                      <th className="h-10 font-medium px-2 text-left">Role</th>
                      <th className="h-10 font-medium px-2 text-left">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 h-10 text-left">
                        {userDetails.firstName}
                      </td>
                      <td className="h-10 px-2 text-left">
                        {userDetails.lastName}
                      </td>
                      <td className="h-10 px-2 text-left">
                        {userDetails.email}
                      </td>
                      <td className="h-10 px-2 text-left">
                        {userDetails.role === "Admin"
                          ? `Admin: ${userDetails.teamName}`
                          : userDetails.role === "Member"
                          ? `Member: ${userDetails.teamName}`
                          : "No role"}
                      </td>

                      <td className="h-10 px-2 text-left">
                        {userDetails.createdAt
                          ? userDetails.createdAt
                              .toDate()
                              .toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                          : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">
          No user details available
        </div>
      )}
    </>
  );
}

export default Users;
