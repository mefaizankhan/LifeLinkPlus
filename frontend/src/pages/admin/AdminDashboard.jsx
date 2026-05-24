import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { 
  Users, 
  Building2, 
  HeartHandshake, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  LogOut, 
  ShieldAlert,
  Search,
  AlertTriangle
} from "lucide-react";
import Navbar from "../../components/layout/Navbar/Navbar";
import axios from "axios";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState("stats"); // stats, hospitals, users, requests

  // Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHospitals: 0,
    pendingHospitals: 0,
    totalRequests: 0,
  });
  const [hospitals, setHospitals] = useState([]);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(data);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    }
  };

  // Fetch Hospitals
  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get("/api/admin/hospitals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHospitals(data);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch Requests
  const fetchRequests = async () => {
    try {
      const { data } = await axios.get("/api/admin/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (user && user.role === "admin") {
      setLoading(true);
      Promise.all([fetchStats(), fetchHospitals(), fetchUsers(), fetchRequests()])
        .then(() => setLoading(false))
        .catch((err) => {
          setError("Failed to load dashboard data.");
          setLoading(false);
        });
    }
  }, [user]);

  // Toggle Hospital Verification
  const handleToggleVerify = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`/api/admin/hospitals/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state
      setHospitals((prev) => 
        prev.map((h) => (h._id === id ? { ...h, isVerified: data.hospital.isVerified } : h))
      );

      // Refresh Stats
      fetchStats();
    } catch (err) {
      alert("Error updating hospital verification status.");
    }
  };

  // Delete User Account
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state
      setUsers((prev) => prev.filter((u) => u._id !== id));
      
      // Refresh Stats
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user account.");
    }
  };

  // Delete/Cancel Blood Request
  const handleDeleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blood request?")) return;

    try {
      await axios.delete(`/api/admin/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state
      setRequests((prev) => prev.filter((r) => r._id !== id));

      // Refresh Stats
      fetchStats();
    } catch (err) {
      alert("Error deleting blood request.");
    }
  };

  if (!user || user.role !== "admin") return null;

  // Filter lists based on search query
  const filteredHospitals = hospitals.filter((h) => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    h.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter((r) => 
    r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      {/* Mounted Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <ShieldAlert className="text-red-500" size={32} /> 
              <span>Admin Control Center</span>
            </h1>
            <p className="text-slate-400 mt-1">Manage system verification, user registrations, and emergency blood requests.</p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600 text-red-200 hover:text-white rounded-xl transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Logout Portal</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Donors</p>
              <h3 className="text-3xl font-black mt-2 text-white">{stats.totalUsers}</h3>
            </div>
            <div className="p-3.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hospitals</p>
              <h3 className="text-3xl font-black mt-2 text-white">{stats.totalHospitals}</h3>
            </div>
            <div className="p-3.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Building2 size={24} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-3xl font-black mt-2 text-yellow-400">{stats.pendingHospitals}</h3>
            </div>
            <div className={`p-3.5 rounded-xl border ${stats.pendingHospitals > 0 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Requests</p>
              <h3 className="text-3xl font-black mt-2 text-white">{stats.totalRequests}</h3>
            </div>
            <div className="p-3.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-xl">
              <Activity size={24} />
            </div>
          </div>

        </div>

        {/* Dashboard Tabs & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-slate-800 pb-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 w-full lg:w-auto overflow-x-auto">
            {[
              { id: "stats", label: "Stats Overview", icon: Activity },
              { id: "hospitals", label: `Hospitals (${hospitals.length})`, icon: Building2 },
              { id: "users", label: `Donors (${users.length})`, icon: Users },
              { id: "requests", label: `Blood Requests (${requests.length})`, icon: HeartHandshake },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          {activeTab !== "stats" && (
            <div className="relative w-full lg:w-80">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-11 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-red-500/50 focus:outline-none placeholder-slate-500 text-sm"
              />
            </div>
          )}
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-red-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-400 font-medium">Securing connection & loading core registries...</p>
          </div>
        )}

        {/* TAB CONTENTS */}
        {!loading && (
          <div>
            
            {/* STATS OVERVIEW TAB */}
            {activeTab === "stats" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Pending Hospital Verifications Checklist */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 lg:col-span-2">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Building2 className="text-red-400" size={20} />
                    <span>Hospitals Requiring Verification</span>
                  </h3>

                  {hospitals.filter((h) => !h.isVerified).length === 0 ? (
                    <div className="text-center py-10 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl">
                      <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                      <p className="text-slate-400 font-semibold">All registered hospitals are verified!</p>
                      <p className="text-slate-600 text-xs mt-1">Excellent work, system operates securely.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hospitals
                        .filter((h) => !h.isVerified)
                        .slice(0, 5)
                        .map((h) => (
                          <div key={h._id} className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                            <div>
                              <h4 className="font-bold text-white text-[15px]">{h.name}</h4>
                              <p className="text-slate-400 text-xs mt-0.5">{h.email}</p>
                              <p className="text-slate-600 text-[10px] uppercase font-bold mt-1">Registered: {new Date(h.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                              onClick={() => handleToggleVerify(h._id, h.isVerified)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                            >
                              Approve Hospital
                            </button>
                          </div>
                        ))}
                      
                      {hospitals.filter((h) => !h.isVerified).length > 5 && (
                        <button
                          onClick={() => setActiveTab("hospitals")}
                          className="w-full py-2.5 text-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
                        >
                          View All Pending Approvals
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Info Box / Alert logs */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <ShieldAlert className="text-red-400" size={20} />
                    <span>System Policy</span>
                  </h3>
                  <div className="text-sm text-slate-300 space-y-4 font-medium leading-relaxed">
                    <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-200 text-xs">
                      <strong className="block mb-1">🏥 Hospital Registration Protocol:</strong>
                      In accordance with LifeLink+ guidelines, every hospital must supply verification credentials. The administrator must review them and verify the profile before they can publish blood bank availability or equipment reserves.
                    </div>
                    <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl text-blue-200 text-xs">
                      <strong className="block mb-1">🛡️ Data Privacy Guidelines:</strong>
                      Only proceed with user or request deletions if verified reports or inappropriate/abusive records have been identified. Keep the registry safe for emergency response operations.
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* HOSPITALS TAB */}
            {activeTab === "hospitals" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Hospital Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Verification Date / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[14px]">
                      {filteredHospitals.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-10 text-slate-500 font-semibold">No hospitals match your search.</td>
                        </tr>
                      ) : (
                        filteredHospitals.map((h) => (
                          <tr key={h._id} className="hover:bg-slate-900/30 transition">
                            <td className="px-6 py-4 font-bold text-white">{h.name}</td>
                            <td className="px-6 py-4 text-slate-300">{h.email}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                h.isVerified 
                                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse"
                              }`}>
                                {h.isVerified ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                {h.isVerified ? "Verified" : "Pending Approval"}
                              </span>
                            </td>
                            <td className="px-6 py-4 flex gap-3 items-center">
                              <button
                                onClick={() => handleToggleVerify(h._id, h.isVerified)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                  h.isVerified
                                    ? "bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300"
                                    : "bg-green-600 hover:bg-green-500 text-white"
                                }`}
                              >
                                {h.isVerified ? "Revoke Verification" : "Approve Account"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DONORS / USERS TAB */}
            {activeTab === "users" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Donor Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Blood Group</th>
                        <th className="px-6 py-4">Points</th>
                        <th className="px-6 py-4">Verified</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[14px]">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-slate-500 font-semibold">No donors found matching your search.</td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-900/30 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                              {u.avatar ? (
                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700 text-xs">
                                  {u.name.charAt(0)}
                                </div>
                              )}
                              <span className="font-bold text-white">{u.name}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-300">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className="bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-xs font-bold">
                                {u.bloodGroup || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white font-bold">{u.points || 0}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                u.isVerified ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                              }`}>
                                {u.isVerified ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition border border-red-500/20 cursor-pointer flex items-center justify-center"
                                title="Delete Donor Account"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REQUESTS TAB */}
            {activeTab === "requests" && (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Requester</th>
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Blood Needed</th>
                        <th className="px-6 py-4">Hospital Location</th>
                        <th className="px-6 py-4">Urgency</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-[14px]">
                      {filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-10 text-slate-500 font-semibold">No blood requests matched.</td>
                        </tr>
                      ) : (
                        filteredRequests.map((r) => (
                          <tr key={r._id} className="hover:bg-slate-900/30 transition">
                            <td className="px-6 py-4">
                              <span className="font-bold text-white">{r.requester?.name || "Unknown"}</span>
                              <span className="block text-[11px] text-slate-500 mt-0.5">{r.requester?.email || "N/A"}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-200">{r.patientName}</td>
                            <td className="px-6 py-4">
                              <span className="bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-xs font-bold mr-2">
                                {r.bloodGroup}
                              </span>
                              <span className="text-xs text-slate-400">{r.unitsRequired} Unit(s)</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-200">{r.hospitalName}</span>
                              <span className="block text-[11px] text-slate-500 mt-0.5">{r.address}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${
                                r.urgency === "critical"
                                  ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                                  : r.urgency === "urgent"
                                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                              }`}>
                                {r.urgency}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                r.status === "fulfilled" 
                                  ? "bg-green-500/10 text-green-400" 
                                  : r.status === "accepted"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-yellow-500/10 text-yellow-400 animate-pulse"
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleDeleteRequest(r._id)}
                                className="p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition border border-red-500/20 cursor-pointer flex items-center justify-center"
                                title="Delete/Cancel Blood Request"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
