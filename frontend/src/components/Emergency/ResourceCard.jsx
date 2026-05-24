import { MapPin, Phone } from "lucide-react";

const ResourceCard = ({ name, type, distance }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-slate-800">{name}</h4>
          <p className="text-sm text-slate-500 capitalize mt-1">{type}</p>
        </div>

        <span className="text-xs bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full font-medium border border-rose-100">
          {distance} km
        </span>
      </div>

      <div className="mt-7 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin size={14} />
          Nearby
        </div>

        <button className="flex items-center gap-2 text-rose-600 font-medium hover:text-rose-700 transition">
          <Phone size={14} />
          Contact
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
