import { useAuth } from "../../hooks/useAuth";
import { LoadingScreen } from "../ui/LoadingSpinner";
import Avater from "../../../public/images/avater.png";

const Dashboard = () => {
  const { userDetails, loading } = useAuth();

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

  const photoToShow = userDetails.photoURL || Avater;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to your dashboard</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                    <span className="text-blue-600">{userDetails.teamName}</span>
                  </>
                )}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Features Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What you can do in this application:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700">Create discussions</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-gray-700">Edit discussions</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-gray-700">Delete discussions</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <span className="text-gray-700">Comment on discussions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;