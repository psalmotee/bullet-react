import UserButton from "../components/dashboard/UserButton";
import DashboardContent from "../components/dashboard/DashboardContent";
import Sidebar from "../components/dashboard/Sidebar";

function Dashboard() {
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
            {/* Dashboard content component */}
            <DashboardContent />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
