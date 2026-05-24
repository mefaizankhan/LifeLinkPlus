import { Activity, HeartHandshake, Award } from "lucide-react";

const StatsCard = ({ title, value, type }) => {
  // Determine icon & color schemes dynamically based on stats category
  const renderIcon = () => {
    switch (type) {
      case "request":
        return {
          icon: <Activity size={24} className="text-red-400 animate-pulse" />,
          bgColor: "bg-red-500/10",
          borderColor: "hover:border-red-500/30",
          glowColor: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]",
        };
      case "donation":
        return {
          icon: <HeartHandshake size={24} className="text-emerald-400" />,
          bgColor: "bg-emerald-500/10",
          borderColor: "hover:border-emerald-500/30",
          glowColor: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        };
      case "credit":
      default:
        return {
          icon: <Award size={24} className="text-amber-400" />,
          bgColor: "bg-amber-500/10",
          borderColor: "hover:border-amber-500/30",
          glowColor: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
    }
  };

  const scheme = renderIcon();

  return (
    <div className={`group bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6
                     transition-all duration-300 transform hover:-translate-y-1 cursor-default
                     ${scheme.borderColor} ${scheme.glowColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-extrabold mt-3 tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {value}
          </p>
        </div>
        
        {/* Floating icon wrapper */}
        <div className={`w-12 h-12 rounded-xl ${scheme.bgColor} flex items-center justify-center
                         transition-transform duration-300 group-hover:scale-110`}>
          {scheme.icon}
        </div>
      </div>
      
      {/* Decorative trendline element */}
      <div className="w-full h-1 bg-slate-800 rounded-full mt-5 overflow-hidden">
        <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${
          type === "request"
            ? "from-red-500 to-rose-400"
            : type === "donation"
            ? "from-emerald-500 to-teal-400"
            : "from-amber-500 to-orange-400"
        }`} />
      </div>
    </div>
  );
};

export default StatsCard;