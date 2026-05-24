import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

const DesktopNav = ({
  navItems,
  isActive,
  handleNavigate,
  user,
  handleLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch active requests and map them as notifications
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const { data } = await axios.get("/api/requests");
        // Only show requests that are active (not completed/fulfilled)
        const activeRequests = data.filter((req) => req.status !== "fulfilled");
        const mapped = activeRequests.map((req) => ({
          id: req._id,
          title: `Urgent: ${req.bloodGroup} Needed!`,
          body: `${req.patientName} needs ${req.unitsRequired} unit(s) at ${req.hospitalName}.`,
          type: req.urgency || "urgent",
          createdAt: req.createdAt,
          unread: true,
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch active requests for notifications:", err);
      }
    };

    fetchRequests();

    // Set an interval to poll for new requests every 30 seconds
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Listen for real-time FCM foreground push notifications
  useEffect(() => {
    const handlePushNotification = (e) => {
      const payload = e.detail;
      const newNotif = {
        id: payload.messageId || Date.now().toString(),
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "An update was received.",
        type: payload.data?.urgency || "urgent",
        createdAt: new Date().toISOString(),
        unread: true,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    };

    window.addEventListener("push-notification", handlePushNotification);
    return () => window.removeEventListener("push-notification", handlePushNotification);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    handleNavigate("/emergency");
    setIsNotificationOpen(false);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      {/* CENTER NAV LINKS */}
      <div className="hidden md:flex items-center flex-1 justify-center gap-2 lg:gap-4 text-base lg:text-lg font-medium">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative px-3 py-1 rounded-lg transition"
          >
            {/* BUTTON */}
            <button
              onClick={() => handleNavigate(item.path)}
              className={`relative z-10 cursor-pointer px-2 py-1 transition-colors duration-300 ${
                isActive(item.path)
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.name}
            </button>

            {/* 🔥 Gradient Border Indicator */}
            {isActive(item.path) && (
              <motion.div
                layoutId="nav-border"
                className="absolute inset-0 rounded-lg p-[1px]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Gradient Border */}
                <div className="w-full h-full rounded-lg bg-gradient-to-r from-red-500 via-blue-500 to-green-500 p-[1px]">
                  
                  {/* Inner Background (to create border effect) */}
                  <div className="w-full h-full bg-slate-900 rounded-lg" />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        {user ? (
          <>
            {/* Notification Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="cursor-pointer relative text-slate-300 hover:text-white transition p-2 hover:bg-slate-800 rounded-full flex items-center justify-center"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-600 text-[10px] font-extrabold rounded-full flex items-center justify-center border border-slate-950 text-white px-1 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                onMarkAllRead={handleMarkAllRead}
                onClearAll={handleClearAll}
                onNotificationClick={handleNotificationClick}
              />
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown
              user={user}
              handleNavigate={handleNavigate}
              handleLogout={handleLogout}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </>
        ) : (
          <button
            onClick={() => handleNavigate("/auth")}
            className="cursor-pointer bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        )}
      </div>
    </>
  );
};

export default DesktopNav;