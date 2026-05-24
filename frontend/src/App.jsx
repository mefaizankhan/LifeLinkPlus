// src/App.jsx

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import EmergencyPage from "./pages/Emergency/EmergencyPage";
import HomePage from "./pages/Home/HomePage";
import AuthPage from "./pages/Auth/AuthPage";
import AboutPage from "./pages/About/AboutPage";
import RequestBlood from "./pages/RequestBlood/RequestBlood";
import Donate from "./pages/Donor/Donate";
import BecomeDonor from "./pages/Donor/BecomeDonor";
import CommunityPage from "./pages/Community/CommunityPage";
import Dashboard from "./pages/dashboard/Dashboard";
import EditProfilePage from "./pages/Profile/EditProfilePage";
import AdminLoginPage from "./pages/Auth/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

import {
  requestNotificationPermission,
  onMessageListener,
} from "./firebase-messaging";

function App() {
  useEffect(() => {
    // Request browser notification permission
    requestNotificationPermission();

    // Listen for foreground notifications
    onMessageListener()
      .then((payload) => {
        console.log("📩 Notification received:", payload);
        // Dispatch custom event to update Navbar notification center in real-time
        const event = new CustomEvent("push-notification", { detail: payload });
        window.dispatchEvent(event);
      })
      .catch((err) => {
        console.error("Notification listener error:", err);
      });
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      <Route path="/request-blood" element={<RequestBlood />} />

      <Route path="/emergency" element={<EmergencyPage />} />

      <Route path="/community" element={<CommunityPage />} />

      <Route path="/donate" element={<Donate />} />

      <Route path="/become-donor" element={<BecomeDonor />} />

      <Route path="/about" element={<AboutPage />} />

      <Route path="/auth" element={<AuthPage />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/profile/edit" element={<EditProfilePage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
