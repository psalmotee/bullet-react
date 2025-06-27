import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { LoadingScreen } from "../ui/LoadingSpinner";
import Avater from "../../../public/images/avater.png";

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [photoToShow, setPhotoToShow] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            const customPhoto = docSnap.data().photoURL;
            const googlePhoto = user.photoURL;
            setPhotoToShow(customPhoto || googlePhoto || Avater);
            toast.success("Welcome back!");
          } else {
            toast.error("User details not found in database.");
          }
        } catch (error) {
          toast.error("Error fetching user details.");
        }
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
        setPhotoToShow(Avater);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />;
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
    <>
      <div className="space-y-8 flex flex-col w-full">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back to your dashboard</p>
        </div>

        {/* Welcome Card */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 py-6 px-4 w-full max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <img
                src={photoToShow}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mx-auto sm:mx-0"
              />

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome{" "}
                  <span className="text-blue-600">
                    {userDetails.firstName} {userDetails.lastName}
                  </span>
                </h2>

                <p className="text-gray-600 mt-1">
                  Your role:{" "}
                  <span className="font-medium uppercase text-gray-900">
                    {userDetails.role}
                    {userDetails.teamName && (
                      <>
                        {" "}
                        of Team{" "}
                        <span className="text-blue-600">
                          {userDetails.teamName}
                        </span>
                      </>
                    )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Card */}
        <div className="px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-6 w-full max-w-3xl">
            <p className="text-lg font-semibold text-gray-900 mb-4">
              In this application you can:
            </p>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Create discussions</span>
                </li>

                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Edit discussions</span>
                </li>

                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Delete discussions</span>
                </li>
              </div>

              <div>
                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">Comment on discussions</span>
                </li>

                <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Delete all comments</span>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
