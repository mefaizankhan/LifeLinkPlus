import { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BecomeDonorForm = ({ bloodGroup, setBloodGroup }) => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bloodGroup) {
      alert("Please select your blood group");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        "/api/users/become-donor",
        { bloodGroup },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // 🔥 update auth context
      login(data);

      alert("You are now a donor 🎉");

      navigate("/donate");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Blood Group
          </label>

          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
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

        {/* Info */}
        <p className="text-sm text-slate-500">
          You will be able to go live and help nearby patients.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Processing..." : "Become Donor"}
        </button>
      </form>
    </motion.div>
  );
};

export default BecomeDonorForm;
