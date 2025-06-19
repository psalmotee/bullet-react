import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";


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
            toast.success("User details fetched successfully.");
          } else {
            console.log("User details not found in database.");
            toast.error("User details not found in database.");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Error fetching user details.");
        }
      } else {
        console.log("No user is signed in");
        toast.info("No user signed in.");
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {userDetails ? (
        <div className="flex flex-col w-full py-6 sm:py-0">
          <div className="w-full max-w-md px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl font-medium text-black">Users</h2>
          </div>
          <div className="px-4 sm:px-6 md:px-8 py-6 w-full overflow-auto">
            <table className="w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className=" text-sm text-gray-500">
                  <th className="h-10 px-2 font-medium text-left">
                    First Name
                  </th>
                  <th className="h-10 px-2 font-medium text-left">Last Name</th>
                  <th className="h-10 px-2 font-medium text-left">Email</th>
                  <th className="h-10 px-2 font-medium text-left">Role</th>
                  <th className="h-10 px-2 font-medium text-left">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="h-10 px-2 text-left">
                    {userDetails.firstName}
                  </td>
                  <td className="h-10 px-2 text-left">
                    {userDetails.lastName}
                  </td>
                  <td className="h-10 px-2 text-left">{userDetails.email}</td>
                  <td className="h-10 px-2 text-left uppercase">
                    {userDetails.role === "Admin"
                      ? `Admin: ${userDetails.teamName}`
                      : userDetails.role === "Member"
                      ? `Member: ${userDetails.teamName}`
                      : "No role"}
                  </td>

                  <td className="h-10 px-2 text-left">
                    {userDetails.createdAt
                      ? userDetails.createdAt.toDate().toLocaleString("en-US", {
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
      ) : (
        <div className="text-center mt-10 text-gray-500">
          <p>
            No user details available. Login{" "}
            <a href="/login" className="text-blue-500">
              here
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}

export default Users;
