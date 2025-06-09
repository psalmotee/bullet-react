// import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider, BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
// import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/dashboard/Dashboard";
// import Test from "./pages/Test";
import Discussions from "./components/dashboard/Discussions";
import ViewDiscussion from "./components/dashboard/ViewDiscussion";
import Users from "./components/dashboard/Users";
import ProfilePage from "./components/dashboard/ProfilePage";
import DashboardLayout from "./pages/DashboardLayout";


const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // { path: "/test", element: <Test /> },
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
