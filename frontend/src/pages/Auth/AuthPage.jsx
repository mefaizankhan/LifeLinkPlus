// src/pages/Auth/AuthPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Logo from "../../components/layout/Logo";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-red-900">
      {/* LEFT SIDE – Branding */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center px-12 text-white relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center max-w-2xl">
          {/* Bigger Logo */}
          <div className="mb-12 w-full flex justify-center scale-125">
            <Logo />
          </div>

          {/* Gradient Headline (Same Style as Nearby Blood Donors) */}
          <h1
            className="text-4xl font-bold mt-4 
                         bg-gradient-to-r from-red-500 via-pink-500 to-blue-500 
                         bg-clip-text text-transparent"
          >
            Saving Lives Starts With You
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Join a real-time emergency response network connecting donors,
            patients, and hospitals instantly.
          </p>

          <div className="mt-6 text-sm text-red-300">
            Trusted by 2,450+ donors
          </div>
        </div>
      </div>

      {/* RIGHT SIDE – Auth */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center px-6 py-12 relative">
        {/* Bigger Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 
                     px-6 py-3 
                     bg-white/10 backdrop-blur-md 
                     border border-white/20 
                     rounded-xl 
                     text-white font-semibold
                     hover:bg-white/20 
                     transition-all duration-300 
                     shadow-lg cursor-pointer"
        >
          ← Back to Home
        </button>

        {/* Glass Card */}
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-white/20">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 font-semibold transition ${
                activeTab === "login"
                  ? "border-b-2 border-red-500 text-red-400"
                  : "text-gray-300 cursor-pointer"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 font-semibold transition ${
                activeTab === "register"
                  ? "border-b-2 border-red-500 text-red-400"
                  : "text-gray-300 cursor-pointer"
              }`}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
