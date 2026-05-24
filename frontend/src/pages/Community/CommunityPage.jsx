// src/pages/Community/CommunityPage.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer";
import { Users, Heart, Award, Calendar, Phone, MapPin, Activity, CheckCircle2, AlertCircle, Clock, Compass, Navigation } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { LocationContext } from "../../context/LocationContext";
import { useNavigate } from "react-router-dom";

import Leaderboard from "../../components/Community/Leaderboard";
import Campaigns from "../../components/Community/Campaigns";

const CommunityPage = () => {
    const { user, updateUser, refreshUser } = useContext(AuthContext);
    const { location, detectLocation } = useContext(LocationContext);
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active"); // "active" | "commitments" | "my-requests" | "fulfilled"
    const [actionLoading, setActionLoading] = useState(null);

    // Calculate distance in km using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius of the earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d.toFixed(1); // 1 decimal place
    };

    // Get donor coordinates
    const getDonorCoords = () => {
        // 1. Browser geolocation
        if (location && location.lat && location.lng) {
            return { lat: location.lat, lng: location.lng };
        }
        // 2. User profile coordinates
        if (user && user.location && user.location.coordinates && user.location.coordinates[0] !== 0) {
            return { lat: user.location.coordinates[1], lng: user.location.coordinates[0] };
        }
        return null;
    };

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/requests");
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const [activeDonors, setActiveDonors] = useState([]);
    const [donorsLoading, setDonorsLoading] = useState(true);

    const fetchActiveDonors = async () => {
        try {
            setDonorsLoading(true);
            const { data } = await axios.get("/api/users/active-donors");
            setActiveDonors(data);
        } catch (error) {
            console.error("Error fetching active donors:", error);
        } finally {
            setDonorsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchActiveDonors();
        detectLocation(); // Auto detect on mount to compute distances!
        refreshUser();
    }, []);

    // Filter requests based on tab
    const getFilteredRequests = () => {
        if (!user) {
            // If not logged in, only show active (pending/accepted) requests
            return requests.filter(r => r.status === "pending" || r.status === "accepted");
        }

        switch (activeTab) {
            case "active":
                // Show requests that are pending, or accepted (but not accepted by current user)
                return requests.filter(r => r.status === "pending" || (r.status === "accepted" && r.acceptedBy?._id !== user._id));
            case "commitments":
                // Requests accepted by the logged-in user
                return requests.filter(r => r.acceptedBy?._id === user._id && r.status === "accepted");
            case "my-requests":
                // Requests created by the logged-in user
                return requests.filter(r => r.requester?._id === user._id);
            case "fulfilled":
                // Fulfilled requests
                return requests.filter(r => r.status === "fulfilled");
            default:
                return requests;
        }
    };

    const handleAcceptRequest = async (requestId) => {
        if (!user || !user.token) {
            alert("Please login first to accept this blood request.");
            navigate("/auth");
            return;
        }

        try {
            setActionLoading(requestId);
            const { data } = await axios.put(`/api/requests/${requestId}/accept`, {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            // Update in requests state
            setRequests(prev => prev.map(r => r._id === requestId ? data : r));
            alert("Thank you! You have accepted this request. Please contact the patient's family immediately to coordinate the donation. ❤️");
            setActiveTab("commitments");
        } catch (error) {
            console.error("Accept Error:", error);
            alert(error.response?.data?.message || "Failed to accept request.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerifyDonation = async (requestId) => {
        if (!user || !user.token) return;

        if (!window.confirm("Are you sure you want to verify this donation? This will close the request and award Honor Points to the donor.")) {
            return;
        }

        try {
            setActionLoading(requestId);
            const { data } = await axios.put(`/api/requests/${requestId}/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            // Update in requests state
            setRequests(prev => prev.map(r => r._id === requestId ? data.request : r));
            
            // Dispatch event to refresh the leaderboard
            window.dispatchEvent(new CustomEvent("refresh-leaderboard"));

            alert(`Donation successfully verified! 🎉 ${data.creditedPoints} Honor Points have been credited to the donor. Thank you for using LifeLink+!`);
        } catch (error) {
            console.error("Verification Error:", error);
            alert(error.response?.data?.message || "Failed to verify donation.");
        } finally {
            setActionLoading(null);
        }
    };

    // Calculate dynamic stats
    const totalLivesSaved = requests.filter(r => r.status === "fulfilled").length + 284; // base + mock
    const activeRequestsCount = requests.filter(r => r.status === "pending" || r.status === "accepted").length;

    // Get color for urgency levels
    const getUrgencyStyles = (urgency) => {
        switch (urgency) {
            case "critical":
                return "bg-red-500 text-white border-red-600 animate-pulse";
            case "urgent":
                return "bg-amber-500 text-white border-amber-600";
            default:
                return "bg-blue-500 text-white border-blue-600";
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Compact Modern Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-2">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Live Community Platform
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-none">
                                Community Hub
                            </h1>
                            <p className="text-slate-500 text-sm mt-2 max-w-xl">
                                Join thousands of dedicated individuals saving lives. Respond to real-time emergency requests, track campaigns, and see top saviors.
                            </p>
                        </div>

                        {/* Compact public community stats pills */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Lives Saved</p>
                                    <p className="text-sm font-black text-slate-700 mt-1">{totalLivesSaved}</p>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Active Donors</p>
                                    <p className="text-sm font-black text-slate-700 mt-1">
                                        {donorsLoading ? "..." : activeDonors.length}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Live Feed</p>
                                    <p className="text-sm font-black text-slate-700 mt-1">{activeRequestsCount} Request{activeRequestsCount !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout for Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column (Active Emergency Requests & Campaigns) */}
                        <div className="col-span-1 lg:col-span-2 space-y-8">
                            
                            {/* Emergency Requests Card */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                            <span className="flex h-3 w-3 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                            </span>
                                            Emergency Blood Requests Feed
                                        </h2>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Directly support patients in immediate need of blood.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => navigate("/request-blood")}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow transition"
                                    >
                                        + Request Blood
                                    </button>
                                </div>

                                {/* Tab Bar for filter */}
                                {user && (
                                    <div className="flex border-b border-slate-100 mb-6 overflow-x-auto gap-2">
                                        <button
                                            onClick={() => setActiveTab("active")}
                                            className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${activeTab === "active" ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                                        >
                                            Active Requests
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("commitments")}
                                            className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${activeTab === "commitments" ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                                        >
                                            My Commitments
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("my-requests")}
                                            className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${activeTab === "my-requests" ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                                        >
                                            My Raised Requests
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("fulfilled")}
                                            className={`pb-3 px-4 text-sm font-semibold whitespace-nowrap border-b-2 transition ${activeTab === "fulfilled" ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                                        >
                                            Past Saves
                                        </button>
                                    </div>
                                )}

                                {/* Requests Feed List */}
                                <div className="space-y-6">
                                    {loading ? (
                                        <div className="flex justify-center items-center py-12">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                                        </div>
                                    ) : getFilteredRequests().length === 0 ? (
                                        <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl">
                                            <AlertCircle className="mx-auto text-slate-400 mb-3" size={32} />
                                            <h3 className="font-semibold text-slate-700 text-lg">No requests found</h3>
                                            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                                                {activeTab === "commitments" 
                                                    ? "You haven't accepted any emergency requests yet. Help save a life today!" 
                                                    : activeTab === "my-requests" 
                                                    ? "You haven't raised any blood requests. They will show up here once submitted." 
                                                    : "All caught up! No pending blood requests fit this criteria."}
                                            </p>
                                            {activeTab === "active" && (
                                                <button 
                                                    onClick={() => navigate("/request-blood")}
                                                    className="mt-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl text-sm transition"
                                                >
                                                    Submit Emergency Request
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <AnimatePresence mode="popLayout">
                                            {getFilteredRequests().map((req) => {
                                                const donorCoords = getDonorCoords();
                                                const receiverLng = req.location?.coordinates?.[0];
                                                const receiverLat = req.location?.coordinates?.[1];
                                                const distance = donorCoords && receiverLat && receiverLng
                                                    ? calculateDistance(donorCoords.lat, donorCoords.lng, receiverLat, receiverLng)
                                                    : null;

                                                return (
                                                    <motion.div
                                                        layout
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        key={req._id}
                                                        className={`p-6 rounded-3xl border transition-all duration-300 ${req.status === "fulfilled" ? "bg-slate-50/80 border-slate-100" : req.acceptedBy?._id === user?._id ? "bg-emerald-50/40 border-emerald-200 shadow-emerald-50/50 shadow-md" : "bg-white border-slate-200 hover:shadow-lg"}`}
                                                    >
                                                        {/* Header Card Row */}
                                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg shadow-sm">
                                                                    {req.bloodGroup}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                                                        {req.patientName}
                                                                    </h3>
                                                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                                                                        <Clock size={12} />
                                                                        Requested {new Date(req.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {/* Distance Pill */}
                                                                {distance && (
                                                                    <span className="bg-red-50 border border-red-200 text-red-700 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                                        📍 {distance} km away
                                                                    </span>
                                                                )}

                                                                {/* Urgency Badge */}
                                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyStyles(req.urgency)}`}>
                                                                    {req.urgency}
                                                                </span>

                                                                {/* Units Required */}
                                                                <span className="bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-full">
                                                                    {req.unitsRequired} Unit{req.unitsRequired > 1 ? "s" : ""} Needed
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Hospital details */}
                                                        <div className="space-y-2 mb-5">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                                                    <div>
                                                                        <span className="font-semibold text-slate-800">{req.hospitalName}</span>
                                                                        <p className="text-xs text-slate-500 mt-0.5">{req.address}</p>
                                                                    </div>
                                                                </div>

                                                                {receiverLat && receiverLng && (
                                                                    <a
                                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${receiverLat},${receiverLng}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-red-600 border border-slate-200 px-3 py-1.5 rounded-xl transition duration-200 flex items-center gap-1 shrink-0 shadow-sm"
                                                                    >
                                                                        <Compass size={14} className="text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
                                                                        Directions
                                                                    </a>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                                <Phone size={16} className="text-slate-400 shrink-0" />
                                                                <a href={`tel:${req.contact}`} className="text-blue-600 font-medium hover:underline flex items-center">
                                                                    {req.contact}
                                                                </a>
                                                            </div>
                                                        </div>

                                                    {/* Interactive Actions footer */}
                                                    <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                                                        {/* Status Details */}
                                                        <div>
                                                            {req.status === "pending" && (
                                                                <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
                                                                    ⌛ Pending Savior
                                                                </span>
                                                            )}
                                                            {req.status === "accepted" && (
                                                                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase">
                                                                    🤝 Accepted by {req.acceptedBy?.name || "Donor"}
                                                                </span>
                                                            )}
                                                            {req.status === "fulfilled" && (
                                                                <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                                                    <CheckCircle2 size={12} /> Donation Verified & Fulfilled
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Buttons */}
                                                        <div>
                                                            {/* Case 1: Pending & Not the user's own request */}
                                                            {req.status === "pending" && user && req.requester?._id !== user._id && (
                                                                <button
                                                                    onClick={() => handleAcceptRequest(req._id)}
                                                                    disabled={actionLoading === req._id}
                                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2 rounded-xl shadow transition duration-200"
                                                                >
                                                                    {actionLoading === req._id ? "Accepting..." : "Accept Request"}
                                                                </button>
                                                            )}

                                                            {/* Case 2: Pending & User not logged in */}
                                                            {req.status === "pending" && !user && (
                                                                <button
                                                                    onClick={() => {
                                                                        alert("Please login first to accept this blood request.");
                                                                        navigate("/auth");
                                                                    }}
                                                                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm px-5 py-2 rounded-xl transition duration-200"
                                                                >
                                                                    Login to Accept
                                                                </button>
                                                            )}

                                                            {/* Case 3: Accepted & User is the requester (Needs Verification) */}
                                                            {req.status === "accepted" && user && req.requester?._id === user._id && (
                                                                <button
                                                                    onClick={() => handleVerifyDonation(req._id)}
                                                                    disabled={actionLoading === req._id}
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2 rounded-xl shadow transition duration-200"
                                                                >
                                                                    {actionLoading === req._id ? "Verifying..." : "Verify Donation"}
                                                                </button>
                                                            )}

                                                            {/* Case 4: Accepted & User is the one who accepted */}
                                                            {req.status === "accepted" && user && req.acceptedBy?._id === user._id && (
                                                                <div className="bg-emerald-50 text-emerald-800 font-bold text-xs p-3 rounded-2xl border border-emerald-100 max-w-xs text-right leading-relaxed">
                                                                    Please donate blood at hospital, then patient's family will verify!
                                                                </div>
                                                            )}

                                                            {/* Case 5: Fulfilled */}
                                                            {req.status === "fulfilled" && (
                                                                <div className="text-slate-500 font-semibold text-xs bg-slate-100 px-3 py-1.5 rounded-xl">
                                                                    Saved by {req.acceptedBy?.name || "a hero"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                            })}
                                        </AnimatePresence>
                                    )}
                                </div>
                            </div>

                            {/* Drives / Campaigns List */}
                            <Campaigns />
                        </div>

                        {/* Right Column (Leaderboard & Real-time Live Feed) */}
                        <div className="col-span-1 space-y-6">
                            {/* Personal Standing Card */}
                            {user && (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/85">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-inner overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-red-600 font-extrabold text-lg">{user.name?.[0]?.toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Your Standing</p>
                                            <h3 className="font-extrabold text-slate-800 text-base mt-1.5 leading-tight">{user.name}</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3 flex flex-col items-center justify-center">
                                            <Award size={18} className="text-amber-500 mb-1" />
                                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider leading-none">Honor Points</p>
                                            <p className="text-xl font-black text-amber-800 mt-1">{user.points || 0}</p>
                                        </div>
                                        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3 flex flex-col items-center justify-center">
                                            <Heart size={18} className="text-red-500 mb-1" />
                                            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider leading-none">Your Level</p>
                                            <p className="text-xs font-extrabold text-red-800 mt-1.5">
                                                {(user.points || 0) >= 300 ? "Gold Savior" : (user.points || 0) >= 100 ? "Silver Savior" : "Bronze Savior"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* Active Emergency Donors Card */}
                             <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                                 <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                     <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                         <span className="flex h-2.5 w-2.5 relative">
                                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                         </span>
                                         Active Emergency Donors
                                     </h3>
                                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                                         Live
                                     </span>
                                 </div>

                                 {donorsLoading ? (
                                     <div className="flex justify-center items-center py-6">
                                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                                     </div>
                                 ) : activeDonors.length === 0 ? (
                                     <div className="text-center py-6 text-slate-400 text-xs">
                                         No donors currently live. Be the first to go live!
                                     </div>
                                 ) : (
                                     <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                                         {activeDonors.map((donor) => {
                                             const donorCoords = getDonorCoords();
                                             const receiverLng = donor.location?.coordinates?.[0];
                                             const receiverLat = donor.location?.coordinates?.[1];
                                             const distance = donorCoords && receiverLat && receiverLng
                                                 ? calculateDistance(donorCoords.lat, donorCoords.lng, receiverLat, receiverLng)
                                                 : null;

                                             return (
                                                 <div key={donor._id} className="p-3 bg-slate-50/60 hover:bg-slate-100/50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 transition">
                                                     <div className="flex items-center gap-2.5 min-w-0">
                                                         <div className="w-9 h-9 rounded-full bg-red-100 border border-red-50 flex items-center justify-center text-red-600 font-extrabold text-sm shrink-0 overflow-hidden">
                                                             {donor.avatar ? (
                                                                 <img src={donor.avatar} alt={donor.name} className="w-full h-full object-cover" />
                                                             ) : (
                                                                 <span>{donor.name[0].toUpperCase()}</span>
                                                             )}
                                                         </div>
                                                         <div className="min-w-0">
                                                             <div className="flex items-center gap-1.5">
                                                                 <span className="font-bold text-slate-800 text-xs truncate max-w-[100px]">
                                                                     {donor.name}
                                                                 </span>
                                                                 <span className="bg-red-500/10 text-red-600 border border-red-500/10 px-1.5 py-0.5 rounded text-[10px] font-black leading-none shrink-0">
                                                                     {donor.bloodGroup}
                                                                 </span>
                                                             </div>
                                                             <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                                                                 {donor.city || "Detected Location"}
                                                             </p>
                                                             {distance && (
                                                                 <span className="text-[9px] font-bold text-red-600 mt-0.5 block">
                                                                     📍 {distance} km away
                                                                 </span>
                                                             )}
                                                         </div>
                                                     </div>

                                                     <a
                                                         href={`tel:${donor.phone}`}
                                                         className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm transition flex items-center justify-center shrink-0 cursor-pointer"
                                                         title={`Call ${donor.name}`}
                                                     >
                                                         <Phone size={14} />
                                                     </a>
                                                 </div>
                                             );
                                         })}
                                     </div>
                                 )}
                             </div>

                             <div className="sticky top-24">
                                 <Leaderboard />
                             </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CommunityPage;
