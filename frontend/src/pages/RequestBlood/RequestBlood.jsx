// src/pages/RequestBlood/RequestBlood.jsx

import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar/Navbar";
import RequestMapView from "../../components/Request/RequestMapView";
import { LocationContext } from "../../context/LocationContext";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/layout/Footer";

const RequestBlood = () => {
  const { detectLocation, loadingLocation, location } =
    useContext(LocationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    contact: "",
    address: "",
    urgency: "urgent",
    verificationFile: null,
    isVerified: false,
  });

  const [previewURL, setPreviewURL] = useState(null);

  // Sync detected address
  useEffect(() => {
    if (location?.address) {
      setFormData((prev) => ({
        ...prev,
        address: location.address,
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      verificationFile: file,
      isVerified: true,
    }));

    // Create preview
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    } else {
      setPreviewURL(null); // PDF case
    }
  };

  const removeVerification = () => {
    setFormData((prev) => ({
      ...prev,
      verificationFile: null,
      isVerified: false,
    }));
    setPreviewURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      alert("You must be logged in to submit an emergency blood request.");
      navigate("/auth");
      return;
    }

    try {
      const payload = {
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        unitsRequired: Number(formData.units),
        urgency: formData.urgency,
        hospitalName: formData.hospital,
        contact: formData.contact,
        address: formData.address,
        location: {
          type: "Point",
          coordinates: location ? [location.lng, location.lat] : (user?.location?.coordinates || [72.8777, 19.0760])
        }
      };

      await axios.post("/api/requests", payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      alert("Emergency Blood Request Submitted Successfully! 🎉 It is now live on the community page.");
      navigate("/community");
    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.response?.data?.message || "Failed to submit emergency blood request. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 px-6 lg:px-16 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Emergency <span className="text-red-600">Blood Request</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Select the required blood group to view matching donors near you and
            submit your request instantly.
          </p>
        </div>

        {/* Equal Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 h-full"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address + Auto Detect */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Hospital Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address manually"
                    className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={detectLocation}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-200 transition"
                  >
                    {loadingLocation
                      ? "Detecting..."
                      : "📍 Auto Detect Location"}
                  </button>
                </div>
              </div>

              {/* Patient Name + Verify */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">
                    Patient Name
                  </label>

                  {!formData.isVerified ? (
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("verifyInput").click()
                      }
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Verify Yourself (Optional)
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm font-semibold">
                      ✅ Verified
                    </span>
                  )}
                </div>

                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="verifyInput"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />

                {/* Document Preview */}
                {formData.verificationFile && (
                  <div className="mt-4 p-4 border rounded-xl bg-slate-50">
                    {previewURL ? (
                      <img
                        src={previewURL}
                        alt="Document Preview"
                        className="w-full max-h-48 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="text-sm text-slate-700">
                        📄 {formData.verificationFile.name}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={removeVerification}
                      className="mt-3 text-red-600 text-sm hover:underline"
                    >
                      Remove Document
                    </button>
                  </div>
                )}
              </div>

              {/* Blood Group + Units + Urgency */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Units Required
                  </label>
                  <input
                    type="number"
                    name="units"
                    value={formData.units}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Urgency Level
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    required
                    className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
              >
                Submit Emergency Request
              </button>
            </form>
          </motion.div>

          {/* RIGHT MAP CARD */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <RequestMapView
              selectedBloodGroup={formData.bloodGroup}
              radius={10}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RequestBlood;
