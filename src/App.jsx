// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import { ToastContainer } from "react-toastify";
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import ProfilePage from "./components/dashboard/ProfilePage";
import Discussion from "./components/dashboard/Discussion";
import Users from "./components/dashboard/Users";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard">
          <Route index element={<Dashboard />} />
          {/* Nested routes for dashboard */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="discussion" element={<Discussion />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="test" element={<Test />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
