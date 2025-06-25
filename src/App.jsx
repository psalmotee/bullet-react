import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LazyWrapper from "./components/common/LazyWrapper";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { LoadingScreen } from "./components/ui/LoadingSpinner";

// Lazy load pages and components
const Landing = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const DashboardLayout = lazy(() => import("./components/layout/DashboardLayout"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const Discussions = lazy(() => import("./components/discussions/Discussions"));
const ViewDiscussion = lazy(() => import("./components/discussion-details/ViewDiscussion"));
const Users = lazy(() => import("./components/users/Users"));
const ProfilePage = lazy(() => import("./components/profile/ProfilePage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LazyWrapper fallback={<LoadingScreen message="Loading..." />}>
        <Landing />
      </LazyWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <LazyWrapper fallback={<LoadingScreen message="Loading login..." />}>
        <Login />
      </LazyWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <LazyWrapper fallback={<LoadingScreen message="Loading registration..." />}>
        <Register />
      </LazyWrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <LazyWrapper fallback={<LoadingScreen message="Loading dashboard..." />}>
        <DashboardLayout />
      </LazyWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyWrapper fallback={<LoadingScreen message="Loading dashboard..." />}>
            <Dashboard />
          </LazyWrapper>
        ),
      },
      {
        path: "profile",
        element: (
          <LazyWrapper fallback={<LoadingScreen message="Loading profile..." />}>
            <ProfilePage />
          </LazyWrapper>
        ),
      },
      {
        path: "users",
        element: (
          <LazyWrapper fallback={<LoadingScreen message="Loading users..." />}>
            <Users />
          </LazyWrapper>
        ),
      },
      {
        path: "discussions",
        children: [
          {
            index: true,
            element: (
              <LazyWrapper fallback={<LoadingScreen message="Loading discussions..." />}>
                <Discussions />
              </LazyWrapper>
            ),
          },
          {
            path: ":id",
            element: (
              <LazyWrapper fallback={<LoadingScreen message="Loading discussion..." />}>
                <ViewDiscussion />
              </LazyWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
}

export default App;