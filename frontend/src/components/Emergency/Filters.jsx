import { SlidersHorizontal } from "lucide-react";

const Filters = ({ selectedType, setSelectedType, radius, setRadius }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8">

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-rose-50 p-2.5 rounded-xl">
          <SlidersHorizontal size={18} className="text-rose-600" />
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
          Filters
        </h3>
      </div>

      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Resource Type
          </label>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          >
            <option value="all">All Resources</option>
            <option value="blood">Blood Banks</option>
            <option value="hospital">Hospitals</option>
            <option value="ambulance">Ambulance</option>
            <option value="icu">ICU Beds</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Search Radius
          </label>

          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm bg-white focus:ring-2 focus:ring-rose-400 focus:outline-none transition"
          >
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default Filters;