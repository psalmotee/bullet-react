import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";

function DashboardLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col">
      <Sidebar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
    </div>
  );
}

export default DashboardLayout;
