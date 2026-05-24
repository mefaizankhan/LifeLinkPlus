import { useNavigate } from "react-router-dom";
import { Droplet, UserPlus, MessageSquare } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      
      <h2 className="text-xl font-bold mb-5 tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        Quick Action Hub
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* 🔴 Request Blood */}
        <button
          onClick={() => navigate("/request-blood")}
          className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
                     bg-slate-950/60 border border-slate-800/80 hover:border-red-500/40 
                     transition-all duration-300 transform hover:-translate-y-1 hover:bg-slate-900/40
                     cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_25px_rgba(239,68,68,0.1)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center 
                          transition-transform duration-300 group-hover:scale-110">
            <Droplet className="text-red-400" size={30} fill="currentColor" />
          </div>
          <div className="text-center">
            <span className="block font-bold text-slate-100 group-hover:text-red-400 transition-colors">
              Request Blood
            </span>
            <span className="block text-[11px] text-slate-400 mt-1 max-w-[150px]">
              Instantly notify nearby eligible donors.
            </span>
          </div>
        </button>

        {/* 🟢 Become Donor */}
        <button
          onClick={() => navigate("/become-donor")}
          className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
                     bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 
                     transition-all duration-300 transform hover:-translate-y-1 hover:bg-slate-900/40
                     cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.1)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center 
                          transition-transform duration-300 group-hover:scale-110">
            <UserPlus className="text-emerald-400" size={30} />
          </div>
          <div className="text-center">
            <span className="block font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
              Become Donor
            </span>
            <span className="block text-[11px] text-slate-400 mt-1 max-w-[150px]">
              Join the register and receive alerts.
            </span>
          </div>
        </button>

        {/* 🔵 Community */}
        <button
          onClick={() => navigate("/community")}
          className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl
                     bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 
                     transition-all duration-300 transform hover:-translate-y-1 hover:bg-slate-900/40
                     cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.1)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center 
                          transition-transform duration-300 group-hover:scale-110">
            <MessageSquare className="text-blue-400" size={30} />
          </div>
          <div className="text-center">
            <span className="block font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
              Community Board
            </span>
            <span className="block text-[11px] text-slate-400 mt-1 max-w-[150px]">
              Engage with other donors & see updates.
            </span>
          </div>
        </button>

      </div>
    </div>
  );
};

export default QuickActions;