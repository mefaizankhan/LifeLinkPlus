import { useState, useContext, useEffect } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DonorFormCard from "./components/DonorFormCard";
import DonorMapView from "./components/DonorMapView";

const Donate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bloodGroup: "",
    isAvailable: false,
    contact: "", 
  });

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  // 🩸 Autofill donor data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        bloodGroup: user.bloodGroup || "",
        contact: user.contact ? user.contact.replace("+91", "") : "",
      }));
    }
  }, [user]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 px-6 lg:px-16 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Become an <span className="text-red-600">Active Donor</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Share your real-time availability and help patients nearby
            instantly.
          </p>
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <DonorFormCard formData={formData} setFormData={setFormData} />

          <DonorMapView bloodGroup={formData.bloodGroup} />
        </div>
      </div>
    </>
  );
};

export default Donate;
