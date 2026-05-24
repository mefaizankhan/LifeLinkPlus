import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, ShieldAlert, KeyRound, Mail } from "lucide-react";
import Logo from "../../components/layout/Logo";
import axios from "axios";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });

      // Enforce admin role check for this login portal
      if (data.role !== "admin") {
        setError("Access Denied: This portal is reserved for administrators only.");
        setLoading(false);
        return;
      }

      // Store user globally and in localStorage
      login(data);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/80 relative overflow-hidden">
      
      {/* Dynamic light effects/blobs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-semibold transition duration-300 shadow-md cursor-pointer flex items-center gap-2"
      >
        ← Back to Home
      </button>

      {/* Brand logo header */}
      <div className="mb-8 flex flex-col items-center">
        <div className="scale-110 mb-4">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-red-500 bg-clip-text text-transparent flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={24} /> Admin Portal
        </h2>
        <p className="text-xs text-slate-400 mt-1">LifeLink+ System Management Console</p>
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl p-8 text-white">
        
        <h3 className="text-xl font-semibold mb-6 text-center text-white/90">
          Sign In to Control Center
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
              <ShieldAlert size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm mb-2 text-slate-300 font-medium">Administrator Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@pluslifelink.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 placeholder-slate-500 text-[15px] transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2 text-slate-300 font-medium">Secure Key</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400">
                <KeyRound size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 placeholder-slate-500 text-[15px] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl transition duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.45)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authorizing...</span>
              </>
            ) : (
              <span>Verify & Launch Dashboard</span>
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center text-xs text-slate-500 font-medium">
        Secured by LifeLink+ Cryptography Standards.
      </div>
    </div>
  );
};

export default AdminLoginPage;
