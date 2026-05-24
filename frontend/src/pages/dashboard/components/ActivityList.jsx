import { ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

const ActivityList = () => {
  const activities = [
    { type: "Emergency Blood Request", status: "Pending", date: "Today", desc: "Requested 2 units of O+ blood for emergency" },
    { type: "Voluntary Blood Donation", status: "Completed", date: "2 days ago", desc: "Donated 1 unit of A+ blood at Central Hospital" },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 rounded-3xl shadow-2xl relative">
      <h2 className="text-xl font-bold mb-6 tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        Recent LifeLink Activity
      </h2>

      <div className="space-y-5">
        {activities.map((item, index) => {
          const isCompleted = item.status === "Completed";
          
          return (
            <div
              key={index}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60
                         transition-all duration-300 hover:border-slate-700/60"
            >
              {/* Status Icons */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
              }`}>
                {isCompleted ? <CheckCircle2 size={20} /> : <Clock size={20} className="animate-pulse" />}
              </div>

              {/* Activity Details */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">
                    {item.type}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.date}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>

                {/* Status pill badge */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isCompleted ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"
                  }`} />
                  <span className={`text-[10px] font-semibold tracking-wider uppercase ${
                    isCompleted ? "text-emerald-400" : "text-amber-400"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Detail arrow anchor */}
              <div className="text-slate-600 group-hover:text-slate-400 transition-colors cursor-pointer self-center">
                <ArrowUpRight size={18} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityList;