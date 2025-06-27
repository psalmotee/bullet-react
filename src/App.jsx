import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// Dashboard Components
import Dashboard from "./components/dashboard/Dashboard";
import Discussions from "./components/discussions/Discussions";
import ViewDiscussion from "./components/discussion-details/ViewDiscussion";
import Users from "./components/users/Users";
import ProfilePage from "./components/profile/ProfilePage";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "users", element: <Users /> },
      {
        path: "discussions",
        children: [
          { index: true, element: <Discussions /> },
          { path: ":id", element: <ViewDiscussion /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <div>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}

export default App;