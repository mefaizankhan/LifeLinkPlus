// src/components/Emergency/EmergencyHeader.jsx

import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { MapPin } from "lucide-react";

const EmergencyHeader = () => {
  const { location } = useContext(LocationContext);

  return (
    <div className="bg-gray-50 border-b border-gray-200 py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 whitespace-nowrap sm:whitespace-normal">
          Emergency Assistance
        </h1>

        <p className="text-gray-600 mb-4 text-sm sm:text-base leading-snug max-w-xl mx-auto">
          Instantly connect to nearby hospitals, blood banks, and life-saving
          support.
        </p>

        {location && (
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm">
            <MapPin size={16} />
            Location detected
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyHeader;
