import {
  User,
  LogOut,
  Heart,
  Box,
  Activity,
  LayoutDashboard,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";

const ProfileDropdown = ({
  user,
  handleNavigate,
  handleLogout,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const dropdownRef = useRef();

  // ✅ Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Prevent render if user not loaded
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* TRIGGER */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer w-10 h-10 rounded-full bg-slate-800 border border-slate-600 hover:border-slate-500 transition overflow-hidden flex items-center justify-center"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center gap-1 w-full h-full">
            <User size={18} />
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400 text-xs"
            >
              ▼
            </motion.span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-14 w-[260px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-3 py-3 border-b border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-white text-[15px] font-semibold leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>

              {/* Blood Group / Admin Role */}
              <div className={`${user.role === 'admin' ? "bg-red-600 text-white" : "bg-red-500/20 text-red-400"} px-2 py-1 rounded-md text-xs font-bold min-w-[36px] text-center capitalize`}>
                {user.role === 'admin' ? 'Admin' : (user.bloodGroup || "N/A")}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="p-1 flex flex-col gap-[2px]">
              {user.role === "admin" ? (
                <Row
                  icon={<LayoutDashboard size={16} className="text-red-500" />}
                  label="Admin Control Panel"
                  onClick={() => handleNavigate("/admin/dashboard")}
                />
              ) : (
                <>
                  <Row
                    icon={<Activity size={16} className="text-red-500" />}
                    label="Requests"
                    onClick={() => handleNavigate("/profile/requests")}
                  />

                  <Row
                    icon={<Heart size={16} className="text-pink-500" />}
                    label="Donations"
                    onClick={() => handleNavigate("/profile/donations")}
                  />

                  <Row
                    icon={<Box size={16} className="text-blue-500" />}
                    label="Equipment"
                    onClick={() => handleNavigate("/profile/equipment")}
                  />

                  <Row
                    icon={<LayoutDashboard size={16} />}
                    label="Dashboard"
                    onClick={() => handleNavigate("/dashboard")}
                  />

                  <Row
                    icon={<User size={16} />}
                    label="Edit Profile"
                    onClick={() => handleNavigate("/profile/edit")}
                  />
                </>
              )}

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="mt-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/20 rounded-md py-2 text-[14px] font-semibold transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Row = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer flex items-center justify-between px-3 py-2.5 text-slate-200 hover:bg-slate-800 rounded-md transition"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-[14px] font-medium">{label}</span>
    </div>

    <span className="text-slate-500 text-sm">›</span>
  </button>
);

export default ProfileDropdown;
