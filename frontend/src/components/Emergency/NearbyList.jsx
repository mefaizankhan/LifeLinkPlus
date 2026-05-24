import ResourceCard from "./ResourceCard";

const NearbyList = ({ selectedType, radius }) => {
  const dummyData = [
    { id: 1, name: "City Blood Bank", type: "blood", distance: 2.4 },
    { id: 2, name: "LifeCare Hospital", type: "hospital", distance: 4.1 },
    {
      id: 3,
      name: "Rapid Ambulance Service",
      type: "ambulance",
      distance: 3.2,
    },
    { id: 4, name: "Central ICU Facility", type: "icu", distance: 8.5 },
  ];

  const filteredByType =
    selectedType === "all"
      ? dummyData
      : dummyData.filter((item) => item.type === selectedType);

  const filteredData = filteredByType.filter(
    (item) => item.distance <= Number(radius),
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-800">Nearby Results</h3>

      {filteredData.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-400 shadow-sm">
          No resources found within selected filters.
        </div>
      ) : (
        filteredData.map((item) => (
          <ResourceCard
            key={item.id}
            name={item.name}
            type={item.type}
            distance={item.distance}
          />
        ))
      )}
    </div>
  );
};

export default NearbyList;
