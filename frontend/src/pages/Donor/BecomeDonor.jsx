import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BecomeDonorForm from "./components/BecomeDonorForm";

const BecomeDonor = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState("");

  // 🔐 Protect route
  useEffect(() => {
    if (!user) navigate("/auth");

    if (user?.isDonor) {
      navigate("/donate");
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 px-6 lg:px-16 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Become a <span className="text-red-600">Blood Donor</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Join our network and help save lives in real-time.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <BecomeDonorForm
            bloodGroup={bloodGroup}
            setBloodGroup={setBloodGroup}
          />
        </div>
      </div>
    </>
  );
};

export default BecomeDonor;
