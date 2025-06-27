import { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { LoadingScreen } from "../ui/LoadingSpinner";

const Users = () => {
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
          console.error("Error fetching user details:", error);
          toast.error("Error fetching user details.");
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
    return <LoadingScreen message="Loading users..." />;
  }

  if (!userDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No user details available.{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Login here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
      </div>

      {/* Users Table */}
      <div className="px-4 sm:px-6 md:px-8 py-6">
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 h-10 text-left font-medium text-gray-500 tracking-wider">
                  First Name
                </th>
                <th className="px-2 h-10 text-left font-medium text-gray-500 tracking-wider">
                  Last Name
                </th>
                <th className="px-2 h-10 text-left font-medium text-gray-500 tracking-wider">
                  Email
                </th>
                <th className="px-2 h-10 text-left font-medium text-gray-500 tracking-wider">
                  Role
                </th>
                <th className="px-2 h-10 text-left font-medium text-gray-500 tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="p-2 h-10 whitespace-nowrap text-sm text-gray-900">
                  {userDetails.firstName}
                </td>
                <td className="p-2 h-10 whitespace-nowrap text-sm text-gray-900">
                  {userDetails.lastName}
                </td>
                <td className="p-2 h-10 whitespace-nowrap text-sm text-gray-900">
                  {userDetails.email}
                </td>
                <td className="p-2 h-10 whitespace-nowrap text-sm text-gray-900 uppercase">
                 
                    {userDetails.role === "Admin"
                      ? `Admin: ${userDetails.teamName}`
                      : userDetails.role === "Member"
                      ? `Member: ${userDetails.teamName}`
                      : "No role"}
                </td>
                <td className="p-2 h-10 whitespace-nowrap text-sm text-gray-900">
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
  );
};

export default Users;
