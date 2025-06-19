// import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
// import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Discussions from "./components/discussions/Discussions";
import ViewDiscussion from "./components/disucussion-details/ViewDiscussion";
import Users from "./components/users/Users";
import ProfilePage from "./components/profile/ProfilePage";
import DashboardLayout from "./pages/DashboardLayout";


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
          { index: true, element: <Discussions /> }, // /dashboard/discussions
          { path: ":id", element: <ViewDiscussion /> }, // /dashboard/discussions/:id
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
