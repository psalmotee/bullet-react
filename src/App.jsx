// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
import Landing from "./pages/LandingPage";
import Login from "./pages/Login";
// import PrivateRoute from "./PriviteRoute";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
