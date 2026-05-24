import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, Info, BellOff } from "lucide-react";
const NotificationDropdown = ({
  notifications,
  onClose,
  onMarkAllRead,
  onClearAll,
  onNotificationClick,
  isOpen,
}) => {
  const dropdownRef = useRef();

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getUrgencyStyles = (type) => {
    switch (type) {
      case "critical":
        return {
          icon: <AlertTriangle className="text-red-500" size={16} />,
          bg: "bg-red-500/10 border-red-500/30",
          title: "text-red-400",
        };
      case "urgent":
        return {
          icon: <AlertTriangle className="text-amber-500" size={16} />,
          bg: "bg-amber-500/10 border-amber-500/30",
          title: "text-amber-400",
        };
      default:
        return {
          icon: <Info className="text-blue-500" size={16} />,
          bg: "bg-blue-500/10 border-blue-500/30",
          title: "text-blue-400",
        };
    }
  };

  const formatTime = (timeStr) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      if (seconds < 5) return "Just now";
      if (seconds < 60) return `${seconds}s ago`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      if (days === 1) return "Yesterday";
      return `${days}d ago`;
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-14 w-[360px] md:w-[400px] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
        >
          {/* HEADER */}
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base">Notifications</h3>
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {notifications.filter((n) => n.unread).length} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {notifications.length > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-slate-400 hover:text-white transition font-medium cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/40">
            {notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <BellOff size={20} />
                </div>
                <p className="text-slate-400 text-sm font-semibold">All Caught Up!</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                  No active requests or notifications matching your profile right now.
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                const styles = getUrgencyStyles(notif.type);
                return (
                  <div
                    key={notif.id}
                    onClick={() => onNotificationClick(notif)}
                    className={`p-4 flex gap-3.5 hover:bg-slate-850/40 transition-colors cursor-pointer relative group ${
                      notif.unread ? "bg-slate-900" : "bg-slate-900/40"
                    }`}
                  >
                    {/* Unread dot */}
                    {notif.unread && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}

                    {/* Icon container */}
                    <div
                      className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center border ${styles.bg}`}
                    >
                      {styles.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`text-[13px] font-extrabold truncate ${styles.title}`}>
                        {notif.title}
                      </p>
                      <p className="text-slate-300 text-xs mt-1 font-medium leading-relaxed">
                        {notif.body}
                      </p>
                      <span className="text-[10px] text-slate-500 font-bold block mt-2">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="px-5 py-3.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-center">
              <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-red-400 transition font-bold cursor-pointer"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;
