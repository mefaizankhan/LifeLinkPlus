import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, Medal, MapPin, Heart } from "lucide-react";

// Fallback Mock Data for Top Heroes if database has 0 points
const mockHeroes = [
    {
        _id: "mock1",
        name: "Dr. Vikram Sharma",
        city: "Mumbai, MH",
        bloodGroup: "O+",
        points: 420,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    },
    {
        _id: "mock2",
        name: "Priya Desai",
        city: "Pune, MH",
        bloodGroup: "A-",
        points: 360,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    },
    {
        _id: "mock3",
        name: "Rahul Khanna",
        city: "Bangalore, KA",
        bloodGroup: "B+",
        points: 250,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    },
    {
        _id: "mock4",
        name: "Aarti Singh",
        city: "Delhi, DL",
        bloodGroup: "AB+",
        points: 180,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarti",
    },
];

const getBadgeColor = (index) => {
    switch (index) {
        case 0:
            return "text-yellow-500 bg-yellow-50 border-yellow-200";
        case 1:
            return "text-slate-400 bg-slate-50 border-slate-200";
        case 2:
            return "text-amber-600 bg-amber-50 border-amber-200";
        default:
            return "text-gray-400 bg-gray-50 border-gray-200";
    }
};

const Leaderboard = () => {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await axios.get("/api/users/leaderboard");
                if (data && data.length > 0) {
                    setHeroes(data);
                } else {
                    setHeroes(mockHeroes);
                }
            } catch (error) {
                console.error("Leaderboard Fetch Error:", error);
                setHeroes(mockHeroes);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Refresh leaderboard every time a donation is completed (custom event listener)
        window.addEventListener("refresh-leaderboard", fetchLeaderboard);
        return () => {
            window.removeEventListener("refresh-leaderboard", fetchLeaderboard);
        };
    }, []);

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Trophy className="text-yellow-500 animate-bounce" /> Heroes of the Month
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Top contributors saving lives in our community.
                    </p>
                </div>
                <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold">
                    Real-time Rank
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    heroes.map((hero, index) => (
                        <div
                            key={hero._id}
                            className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300 group"
                        >
                            {/* Left part: Rank & Info */}
                            <div className="flex items-center gap-4 md:gap-6">
                                {/* Rank Number */}
                                <div className={`w-8 font-bold text-lg text-center ${index < 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                                    #{index + 1}
                                </div>

                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-50 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-bold text-red-600 text-xl">
                                        {hero.avatar ? (
                                            <img src={hero.avatar} alt={hero.name} className="w-full h-full object-cover" />
                                        ) : (
                                            hero.name.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    {/* Trophy / Medal overlap */}
                                    {index < 3 && (
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white ${getBadgeColor(index).split(' ')[1]} ${getBadgeColor(index).split(' ')[0]}`}>
                                            {index === 0 ? <Trophy size={12} /> : <Medal size={12} />}
                                        </div>
                                    )}
                                </div>

                                {/* Name & Region */}
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-base md:text-lg group-hover:text-red-600 transition-colors">
                                        {hero.name}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-0.5">
                                        <span className="flex items-center gap-1"><MapPin size={12} /> {hero.city || "India"}</span>
                                        {hero.bloodGroup && (
                                            <>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">
                                                    {hero.bloodGroup}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right part: Honor Points */}
                            <div className="text-right flex items-center gap-2 md:gap-3">
                                <div className="bg-red-50 p-2 md:p-3 rounded-xl border border-red-100 flex items-center gap-2 md:gap-3">
                                    <div className="text-right">
                                        <p className="text-lg md:text-xl font-bold text-red-600 leading-none">{hero.points}</p>
                                        <p className="text-[10px] font-semibold text-red-400/80 uppercase mt-1">Honor</p>
                                    </div>
                                    <Heart className="text-red-500 fill-current opacity-20 hidden sm:block animate-pulse" size={24} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
