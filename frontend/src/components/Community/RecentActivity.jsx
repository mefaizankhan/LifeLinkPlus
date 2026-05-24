import React from "react";
import { CheckCircle2, Heart, Share2, Activity, Clock } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "donation",
        user: "Rahul K.",
        action: "completed a blood donation",
        target: "City Hospital",
        time: "10 mins ago",
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
    },
    {
        id: 2,
        type: "equipment",
        user: "Sneha M.",
        action: "shared an Oxygen Cylinder",
        target: "Andheri East",
        time: "45 mins ago",
        icon: Share2,
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    {
        id: 3,
        type: "thanks",
        user: "Amit's Family",
        action: "sent a thank you note to",
        target: "Priya D.",
        message: "\"Thank you for your timely help! You saved a life today.\"",
        time: "2 hours ago",
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-50",
        border: "border-green-100",
    },
    {
        id: 4,
        type: "request",
        user: "Suresh",
        action: "raised an urgent request for",
        target: "O+ Blood",
        time: "3 hours ago",
        icon: Activity,
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-100",
    },
    {
        id: 5,
        type: "donation",
        user: "Kiran R.",
        action: "completed a blood donation",
        target: "Fortis Care",
        time: "5 hours ago",
        icon: Heart,
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
    },
];

const RecentActivity = () => {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-blue-500" /> Live Feed
                </h2>
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>

            {/* Activity Timeline */}
            <div className="relative flex-grow overflow-hidden">
                {/* Continuous Line */}
                <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-slate-100 hidden md:block"></div>

                <div className="space-y-6 relative z-10">
                    {activities.map((item, index) => (
                        <div key={item.id} className="relative flex items-start gap-4 group">

                            {/* Timeline Icon */}
                            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${item.bg} ${item.color} z-10 group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon size={20} className={item.type === 'donation' ? 'fill-current opacity-80' : ''} />
                            </div>

                            {/* Activity Content */}
                            <div className="flex-grow pt-1.5 pb-2">
                                <p className="text-sm md:text-base text-slate-700 leading-snug">
                                    <span className="font-semibold text-slate-900">{item.user}</span>{" "}
                                    <span className="text-slate-500">{item.action}</span>{" "}
                                    <span className="font-semibold text-slate-800">{item.target}</span>
                                </p>

                                {/* Optional Thank You Message */}
                                {item.message && (
                                    <div className="mt-3 p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 italic border-l-4 border-l-green-400">
                                        {item.message}
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
                                    <Clock size={12} />
                                    {item.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0">
                Load More Activity
            </button>
        </div>
    );
};

export default RecentActivity;
