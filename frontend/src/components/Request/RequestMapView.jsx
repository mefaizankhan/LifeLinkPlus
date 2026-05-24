import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useContext, useEffect } from "react";
import { LocationContext } from "../../context/LocationContext";

// 🔥 Recenter Map Component
const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 14, {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
};

// Custom Icons
const createIcon = (color, emoji) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:34px;
        height:34px;
        background:${color};
        border-radius:50%;
        border:3px solid white;
        box-shadow:0 4px 12px rgba(0,0,0,0.2);
        font-size:16px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });

const userIcon = createIcon("#e11d48", "📍");
const donorIcon = createIcon("#ef4444", "🩸");

const RequestMapView = ({ selectedBloodGroup, radius = 10 }) => {
  const { location } = useContext(LocationContext);

  const center = location || { lat: 28.6139, lng: 77.209 };

  // Dummy Donor Data (Replace with backend later)
  const donors = [
    {
      id: 1,
      name: "Rahul Sharma",
      bloodGroup: "A+",
      position: [center.lat + 0.01, center.lng + 0.01],
    },
    {
      id: 2,
      name: "Anita Verma",
      bloodGroup: "B+",
      position: [center.lat - 0.01, center.lng + 0.015],
    },
    {
      id: 3,
      name: "Karan Singh",
      bloodGroup: "A+",
      position: [center.lat + 0.015, center.lng - 0.01],
    },
  ];

  const filteredDonors = selectedBloodGroup
    ? donors.filter((d) => d.bloodGroup === selectedBloodGroup)
    : [];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[560px] z-10">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <RecenterMap center={center} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[center.lat, center.lng]} icon={userIcon}>
          <Popup>Your Location</Popup>
        </Marker>

        <Circle
          center={[center.lat, center.lng]}
          radius={radius * 1000}
          pathOptions={{
            color: "#e11d48",
            fillColor: "#fda4af",
            fillOpacity: 0.2,
          }}
        />

        {filteredDonors.map((donor) => (
          <Marker key={donor.id} position={donor.position} icon={donorIcon}>
            <Popup>
              <strong>{donor.name}</strong>
              <br />
              Blood Group: {donor.bloodGroup}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RequestMapView;