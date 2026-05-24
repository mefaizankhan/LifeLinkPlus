// src/components/layout/Navbar/MobileProfileCard.jsx

import { User, Droplet, LogOut } from "lucide-react";

const MobileProfileCard = ({ user, handleLogout }) => {
  return (
    <div className="mt-12 w-full max-w-sm">
      <div className="flex items-start justify-between bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
        {/* Left Side - User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="user avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={24} />
            )}
          </div>

          <div>
            <p className="text-white font-bold text-lg">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        {/* Right Side - Blood Group (ONLY if donor) */}
        {user?.isDonor && user?.bloodGroup && (
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded-lg shadow-md">
            <Droplet size={14} />
            <span className="text-xs font-bold">{user.bloodGroup}</span>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="cursor-pointer flex justify-center items-center gap-3 w-full py-4 mt-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-white font-bold transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default MobileProfileCard;
