import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmergencyCard = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(false);
        navigate("/emergency", {
          state: { lat: latitude, lng: longitude },
        });
      },
      () => {
        setLoading(false);
        alert("Location access denied.");
      },
    );
  };

  const handleSearchCity = () => {
    if (!city.trim()) return;
    navigate(`/emergency?city=${city}`);
  };

  return (
    <div
      className="relative
                 bg-white/90 backdrop-blur-md
                 rounded-[28px] md:rounded-[32px]
                 p-6 md:p-16
                 text-center w-full
                 border border-white/60
                 shadow-[0_30px_80px_rgba(239,68,68,0.12)]
                 transition-all duration-500
                 hover:-translate-y-2
                 overflow-hidden"
    >
      {/* Ambient Glow */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72
                   bg-red-200/40 rounded-full blur-3xl
                   pointer-events-none"
      />

      <div className="relative z-10">
        {/* Heading */}
        <h3 className="font-[var(--font-heading)] text-lg md:text-2xl font-semibold text-slate-900 whitespace-nowrap">
          Find Emergency Resources
        </h3>

        {/* Description */}
        <p
          className="text-slate-500 mt-3 md:mt-4 mb-6 md:mb-12
                      text-sm md:text-base
                      max-w-[260px] md:max-w-xl
                      mx-auto leading-relaxed"
        >
          Detect your location or search manually to connect with nearby
          hospitals and life-saving support.
        </p>

        <div className="flex flex-col gap-6 md:gap-8 items-center">
          {/* Detect Location Button */}
          <button
            onClick={handleDetectLocation}
            className="flex items-center justify-center gap-2
                       bg-gradient-to-r from-red-600 to-red-500
                       text-white
                       px-6 md:px-8
                       py-3
                       rounded-xl
                       text-sm md:text-base
                       font-semibold
                       whitespace-nowrap
                       hover:from-red-700 hover:to-red-600
                       transition-all duration-300
                       shadow-lg hover:shadow-2xl
                       mx-auto"
          >
            <MapPin size={20} />
            {loading ? "Detecting Location..." : "Detect My Location"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Search Row */}
          <div className="flex gap-3 w-full">
            <input
              type="text"
              placeholder="Enter City or Pincode"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-slate-300
                         rounded-xl
                         px-4
                         py-3
                         w-full
                         text-sm
                         focus:outline-none
                         focus:ring-2 focus:ring-red-400
                         focus:border-red-400
                         transition-all"
            />

            <button
              onClick={handleSearchCity}
              className="flex items-center justify-center
                         bg-slate-900 text-white
                         px-5
                         py-3
                         rounded-xl
                         hover:bg-slate-800
                         transition-all duration-300
                         shadow-md hover:shadow-lg"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
