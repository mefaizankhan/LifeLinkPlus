import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { MapPin, Phone, User as UserIcon, Calendar, Info, Heart, Edit3 } from "lucide-react";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer";

import StatsCard from "./components/StatsCard";
import QuickActions from "./components/QuickActions";
import ActivityList from "./components/ActivityList";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 🔥 Retrieve user dynamically from context to enable instant updates
  const { user, refreshUser } = useContext(AuthContext);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <>
      <Navbar />

      {/* Main Container - Dark Premium Aesthetic */}
      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pt-24 pb-12">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-600 rounded-full blur-[160px] opacity-15 pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[180px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-40 left-[20%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          {/* Header Greeting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(" ")[0] || "Hero"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Your life-saving activities and emergency matches for today.
              </p>
            </div>
            
            <button
              onClick={() => navigate("/profile/edit")}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700
                       border border-white/10 shadow-[0_4px_20px_rgba(239,68,68,0.2)]
                       transition-all duration-300 transform hover:scale-[1.03] cursor-pointer text-sm font-semibold"
            >
              <Edit3 size={16} className="group-hover:rotate-12 transition-transform" />
              Edit Profile
            </button>
          </div>

          {/* 🔥 PROFILE SUMMARY PANEL (Glassmorphism) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Soft inner panel accent glow */}
            <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
            
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              
              {/* Profile Avatar Frame with Glowing Ring */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700/80 shadow-[0_0_25px_rgba(239,68,68,0.1)]">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500/20 via-slate-800 to-blue-500/20 flex items-center justify-center text-3xl font-extrabold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                {/* Active Donor Indicator */}
                {user?.isDonor && (
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-500 border border-slate-900 text-[10px] items-center justify-center text-white font-bold" title="Available to Donate">
                      🩸
                    </span>
                  </span>
                )}
              </div>

              {/* User Bio and Grid Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                      {user?.name || "LifeLink User"}
                    </h2>
                    
                    {/* Role Badge */}
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      {user?.role || "User"}
                    </span>
                    
                    {/* Availability Badge */}
                    {user?.isDonor && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400 tracking-wide">
                        Active Donor
                      </span>
                    )}
                  </div>
                  
                  {/* Email & Bio */}
                  <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                  
                  <p className="text-slate-300 text-sm mt-3 italic max-w-2xl border-l-2 border-red-500/30 pl-3 py-1 bg-white/[0.01] rounded-r-lg">
                    {user?.bio || "No biography provided yet. Edit your profile to tell the community about yourself!"}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  
                  {/* Blood Group */}
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-red-500">
                      <Heart size={16} fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Blood Type</p>
                      <p className="text-sm font-bold text-red-400">{user?.bloodGroup || "N/A"}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Location</p>
                      <p className="text-sm font-semibold truncate text-slate-300">{user?.city || "Not Set"}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Contact</p>
                      <p className="text-sm font-semibold truncate text-slate-300">{user?.phone || "Not Set"}</p>
                    </div>
                  </div>

                  {/* Age & Gender */}
                  <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center text-orange-400">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Gender & Age</p>
                      <p className="text-sm font-semibold text-slate-300">
                        {user?.gender && user.gender !== "Prefer not to say" ? user.gender : "N/A"}
                        {user?.age ? `, ${user.age} yrs` : ""}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* 📊 STATS PANEL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatsCard title="Emergency Requests" value={user?.requests || 0} type="request" />
            <StatsCard title="Life-Saving Donations" value={user?.donations || 0} type="donation" />
            <StatsCard title="Honor Credits" value={user?.points || user?.credits || 0} type="credit" />
          </div>

          {/* ⚡ QUICK ACTIONS */}
          <QuickActions />

          {/* 📋 ACTIVITY */}
          <ActivityList />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
