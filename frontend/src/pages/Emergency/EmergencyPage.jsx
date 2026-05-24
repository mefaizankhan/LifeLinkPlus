// src/pages/Emergency/EmergencyPage.jsx

import { useContext, useState, useEffect } from "react";
import { LocationContext } from "../../context/LocationContext";

import Navbar from "../../components/layout/Navbar/Navbar";
import MapView from "../../components/Emergency/MapView";
import Filters from "../../components/Emergency/Filters";
import NearbyList from "../../components/Emergency/NearbyList";
import ViewToggle from "../../components/Emergency/ViewToggle";
import Footer from "../../components/layout/Footer";
import { MapPin } from "lucide-react";

const EmergencyPage = () => {
  const { location, detectLocation, loadingLocation } =
    useContext(LocationContext);

  const [view, setView] = useState("map");
  const [selectedType, setSelectedType] = useState("all");
  const [radius, setRadius] = useState("10");
  const [city, setCity] = useState("");
  const [loadingCity, setLoadingCity] = useState(false);

  // Reverse Geocoding (Lat/Lng → City Name)
  useEffect(() => {
    if (!location) return;

    const fetchCity = async () => {
      try {
        setLoadingCity(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`,
        );

        const data = await res.json();

        const detectedCity =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          "Unknown Location";

        setCity(detectedCity);
      } catch (error) {
        console.error("Failed to fetch city:", error);
        setCity("Location detected");
      } finally {
        setLoadingCity(false);
      }
    };

    fetchCity();
  }, [location]);

  // If location not granted
  if (!location) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 px-4">
          <div className="bg-white p-8 sm:p-14 rounded-3xl shadow-2xl border border-slate-200 text-center max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3">
              Location Required
            </h2>

            <p className="text-slate-500 mb-6 text-sm sm:text-base">
              Please allow location access to continue.
            </p>

            <button
              onClick={detectLocation}
              disabled={loadingLocation}
              className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loadingLocation ? "Detecting..." : "Enable Location"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="relative bg-gradient-to-br from-rose-50 via-white to-red-50 min-h-screen overflow-hidden">
        {/* Soft Radial Glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-14 md:pt-22 pb-16 md:pb-24">
          {/* Header */}
          <div className="mb-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight leading-tight whitespace-nowrap sm:whitespace-normal">
              Emergency Assistance
            </h1>

            <p className="text-slate-500 mt-2 text-base sm:text-lg leading-snug max-w-xl">
              Real-time access to hospitals, blood banks and emergency care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Main Section */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8 md:space-y-10">
              {/* Location Badge + Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                {/* Dynamic Location Badge */}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md text-rose-600 px-5 py-2 rounded-full text-sm font-medium border border-rose-100 shadow-md shadow-rose-200/30 w-fit">
                  <MapPin size={14} />
                  {loadingCity ? "Detecting location..." : city}
                </div>

                <ViewToggle view={view} setView={setView} />
              </div>

              {/* Map or List View */}
              {view === "map" ? (
                <>
                  <MapView radius={Number(radius)} />
                  <NearbyList selectedType={selectedType} radius={radius} />
                </>
              ) : (
                <NearbyList selectedType={selectedType} radius={radius} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit mt-6 lg:mt-0">
              <Filters
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                radius={radius}
                setRadius={setRadius}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EmergencyPage;
