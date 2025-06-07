import { Outlet } from "react-router-dom";
import UserButton from "../components/dashboard/UserButton";
import Sidebar from "../components/dashboard/Sidebar";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex justify-end pt-4 pr-4">
          <UserButton />
        </div>
        <div className="px-14 pt-10">
          <Outlet />
          {/* This renders the current nested route (Profile, Discussions, etc.) */}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
