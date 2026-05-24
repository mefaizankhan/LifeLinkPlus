import { Map, List } from "lucide-react";

const ViewToggle = ({ view, setView }) => {
  return (
    <div className="flex bg-white rounded-full shadow-md border border-slate-200 p-1">
      <button
        onClick={() => setView("map")}
        className={`flex items-center gap-2 px-6 py-2 text-sm rounded-full transition ${
          view === "map"
            ? "bg-rose-600 text-white shadow"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Map size={14} />
        Map
      </button>

      <button
        onClick={() => setView("list")}
        className={`flex items-center gap-2 px-6 py-2 text-sm rounded-full transition ${
          view === "list"
            ? "bg-rose-600 text-white shadow"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <List size={14} />
        List
      </button>
    </div>
  );
};

export default ViewToggle;
