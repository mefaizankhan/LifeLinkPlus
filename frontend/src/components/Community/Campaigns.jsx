import React from "react";
import { Calendar, MapPin, Users, ArrowRight, Heart } from "lucide-react";

const campaigns = [
    {
        id: 1,
        title: "Mega Blood Donation Camp",
        organizer: "Rotary Club of Mumbai",
        date: "15 Oct, 2024",
        time: "10:00 AM - 4:00 PM",
        location: "Lions Community Hall, Andheri",
        attendees: 120,
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=400&h=200",
    },
    {
        id: 2,
        title: "Corporate Health Drive",
        organizer: "TechCorp Solutions",
        date: "22 Oct, 2024",
        time: "9:00 AM - 2:00 PM",
        location: "Tech Park, Hinjewadi, Pune",
        attendees: 85,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400&h=200",
    }
];

const Campaigns = () => {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-red-500" /> Upcoming Drives
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Join nearby donation camps and campaigns.
                    </p>
                </div>
                <button className="hidden md:flex text-sm font-semibold text-slate-600 hover:text-red-600 transition items-center gap-1">
                    Host a Drive <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((camp) => (
                    <div key={camp.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full">

                        {/* Image Header */}
                        <div className="h-32 md:h-40 w-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                            <img src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-red-600 flex items-center shadow-sm">
                                {camp.date.split(',')[0]}
                            </div>
                        </div>

                        {/* Campaign Details */}
                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 group-hover:text-red-600 transition-colors">{camp.title}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-4">by {camp.organizer}</p>

                            <div className="space-y-2 mt-auto">
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{camp.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar size={16} className="text-slate-400 shrink-0" />
                                    <span>{camp.time}</span>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                    <Users size={14} className="text-blue-500" /> {camp.attendees} Attending
                                </div>
                                <button className="text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition-colors">
                                    Register
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Mobile Host Button */}
            <button className="w-full mt-6 md:hidden py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 font-medium hover:border-red-300 hover:text-red-600 transition-colors flex justify-center items-center gap-2">
                <Heart size={18} /> Host a Blood Drive
            </button>
        </div>
    );
};

export default Campaigns;
