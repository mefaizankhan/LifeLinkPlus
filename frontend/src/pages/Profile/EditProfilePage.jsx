import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Camera, ArrowLeft, Save, X, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  // Form states initialized with current user details
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Prefer not to say");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [isDonor, setIsDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [avatar, setAvatar] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync user details on mount/context load
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setPhone(user.phone || "");
      setGender(user.gender || "Prefer not to say");
      setAge(user.age || "");
      setCity(user.city || "");
      setIsDonor(user.isDonor || false);
      setBloodGroup(user.bloodGroup || "O+");
      setAvatar(user.avatar || null);
    }
  }, [user]);

  // Handle Profile Photo change - Convert to Base64 String
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Image size should be less than 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Base64 Data URL
        setErrorMsg("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      
      const { data } = await axios.put(
        "/api/users/profile",
        {
          name,
          bio,
          phone,
          gender,
          age: age ? Number(age) : null,
          city,
          isDonor,
          bloodGroup: isDonor ? bloodGroup : undefined,
          avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Update global context state and localStorage
      updateUser(data);
      
      setSuccessMsg("Profile updated successfully!");
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden pt-24 pb-12">
        {/* Glow Accents */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-red-600 rounded-full blur-[150px] opacity-15 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          
          {/* Back Navigation Link */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-red-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-8">
              Update Profile Details
            </h1>

            {/* Notification Boxes */}
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {successMsg}
              </div>
            )}
            
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 🖼️ INTERACTIVE PROFILE AVATAR UPLOAD */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800/60">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-800 border-2 border-slate-700/80 overflow-hidden flex items-center justify-center shadow-lg relative">
                    {avatar ? (
                      <img src={avatar} alt="avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-slate-800 to-red-500/20 flex items-center justify-center text-3xl font-bold">
                        {name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  
                  {/* File Selector Hover Overlay */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-3xl cursor-pointer transition-opacity duration-300 border border-red-500/40"
                  >
                    <Camera size={24} className="text-white" />
                    <span className="text-[10px] text-white font-semibold mt-1">Upload Photo</span>
                  </label>
                  
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-200">Profile Photo</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Upload a square JPG, PNG, or WEBP image. Maximum file size of 2MB. Photo updates instantly across the portal.
                  </p>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => setAvatar(null)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <X size={12} /> Remove photo
                    </button>
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 25"
                    min="18"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm transition-all"
                  >
                    <option value="Male" className="bg-slate-900 text-white">Male</option>
                    <option value="Female" className="bg-slate-900 text-white">Female</option>
                    <option value="Other" className="bg-slate-900 text-white">Other</option>
                    <option value="Prefer not to say" className="bg-slate-900 text-white">Prefer not to say</option>
                  </select>
                </div>

                {/* City / Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">City / Location</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm placeholder-slate-600 transition-all"
                  />
                </div>

                {/* Blood Group */}
                {isDonor && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm transition-all text-red-400 font-bold"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg} className="bg-slate-900 text-slate-200 font-semibold">{bg}</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>

              {/* Biography / Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Biography (Bio)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community how you would like to help..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 focus:border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500/20 text-slate-200 text-sm placeholder-slate-600 transition-all resize-none"
                />
              </div>

              {/* 🩸 Available to Donate Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80">
                <div className="pr-4">
                  <h3 className="text-sm font-bold text-slate-200">Register as Emergency Donor</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    When active, nearby hospitals and users can request blood match updates and notify you directly during emergencies.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsDonor(!isDonor)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    isDonor ? "bg-emerald-500" : "bg-slate-850"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isDonor ? "translate-x-6" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-850/50 hover:text-white
                           transition-all text-slate-400 text-sm font-semibold cursor-pointer text-center disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl
                           bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700
                           text-white text-sm font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]
                           cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(239,68,68,0.2)]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Profile
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditProfilePage;
