import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { LocationContext } from "../../../context/LocationContext";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DonorFormCard = ({ formData, setFormData }) => {
  const { detectLocation, loadingLocation, location } =
    useContext(LocationContext);
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for contact
    if (name === "contact") {
      const cleanValue = value.replace(/\D/g, "");
      setFormData({ ...formData, contact: cleanValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const toggleAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      isAvailable: !prev.isAvailable,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.bloodGroup) {
      alert("Please select blood group");
      return;
    }

    if (!location) {
      alert("Please detect location");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.contact)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "/api/users/profile",
        {
          isDonor: true,
          bloodGroup: formData.bloodGroup,
          phone: `+91${formData.contact}`,
          isAvailable: formData.isAvailable,
          location: {
            type: "Point",
            coordinates: [location.lng, location.lat]
          },
          city: location.address || "Detected Location",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateUser(data);
      alert("You are now LIVE as a donor 🚀");
      navigate("/community");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to go live. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 h-full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            readOnly
            value={location?.address || "Location not detected"}
            className="w-full p-3 border rounded-xl"
          />

          <button
            type="button"
            onClick={detectLocation}
            className="bg-red-100 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-200 transition"
          >
            {loadingLocation ? "Detecting..." : "📍 Auto Detect Location"}
          </button>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Blood Group
          </label>

          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 border rounded-xl focus:ring-2 focus:ring-red-500"
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

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Contact Number
          </label>

          <div className="flex mt-2">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-lg">
              +91
            </span>

            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter 10-digit number"
              maxLength={10}
              className="w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
          <span className="font-medium text-slate-700">
            Available for Donation
          </span>

          <button
            type="button"
            onClick={toggleAvailability}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition ${
              formData.isAvailable ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform ${
                formData.isAvailable ? "translate-x-7" : ""
              }`}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Going Live...</span>
            </>
          ) : (
            <span>Go Live as Donor 🚀</span>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default DonorFormCard;
