import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const RegisterForm = () => {
  const [accountType, setAccountType] = useState("user");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isDonor, setIsDonor] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtpNotice, setDevOtpNotice] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // =========================
  // 📩 STEP 1 → SEND OTP
  // =========================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setDevOtpNotice("");
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/send-otp", { email });
      if (data.otp) {
        setOtp(data.otp);
        setDevOtpNotice("Local Dev Notice: Server SMTP email failed. OTP retrieved from server console fallback automatically!");
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ✅ STEP 2 → VERIFY OTP
  // =========================
  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role: accountType,
      };

      if (accountType === "user") {
        payload.isDonor = isDonor;
        if (isDonor) payload.bloodGroup = bloodGroup;
      }

      const { data } = await axios.post("/api/auth/verify-otp", {
        ...payload,
        otp,
      });

      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSendOtp}>
      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {/* STEP 1 → FORM */}
      {step === 1 && (
        <>
          {/* Account Type */}
          <div>
            <label className="block text-sm mb-2">Register As</label>
            <div className="flex gap-2">
              {["user", "hospital"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setAccountType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition ${
                    accountType === type
                      ? "bg-red-600"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm mb-2">
              {accountType === "hospital"
                ? "Hospital Name"
                : "Full Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Donor */}
          {accountType === "user" && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDonor}
                  onChange={() => setIsDonor(!isDonor)}
                />
                <label>I want to register as donor</label>
              </div>

              {isDonor && (
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              )}
            </>
          )}

          {/* Send OTP */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-600 rounded-lg"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 → OTP */}
      {step === 2 && (
        <>
          <p className="text-sm text-gray-300 text-center">
            OTP sent to <span className="text-red-400">{email}</span>
          </p>

          {devOtpNotice && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-2 rounded-lg text-xs text-center leading-relaxed">
              ⚠️ {devOtpNotice}
            </div>
          )}

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border text-center font-mono tracking-widest text-lg"
          />

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full py-2 bg-green-600 rounded-lg"
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>

          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full py-2 bg-gray-600 rounded-lg"
          >
            Back
          </button>
        </>
      )}
    </form>
  );
};

export default RegisterForm;