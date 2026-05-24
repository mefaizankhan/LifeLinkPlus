// src/components/Help/MapView.jsx

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import { useContext } from "react";
import { LocationContext } from "../../context/LocationContext";

// ---------- Custom Icon Generator ----------
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

// ---------- Icons ----------
const userIcon = createIcon("#e11d48", "📍");
const bloodIcon = createIcon("#ef4444", "🩸");
const hospitalIcon = createIcon("#3b82f6", "🏥");
const ambulanceIcon = createIcon("#10b981", "🚑");
const icuIcon = createIcon("#8b5cf6", "🛏️");

const MapView = ({ radius = 10 }) => {
  const { location } = useContext(LocationContext);

  const center = location || { lat: 28.6139, lng: 77.209 }; // fallback Delhi

  // Dummy Data (Later will come from backend)
  const resources = [
    {
      id: 1,
      name: "City Blood Bank",
      type: "blood",
      position: [center.lat + 0.01, center.lng + 0.01],
    },
    {
      id: 2,
      name: "LifeCare Hospital",
      type: "hospital",
      position: [center.lat - 0.01, center.lng + 0.015],
    },
    {
      id: 3,
      name: "Rapid Ambulance",
      type: "ambulance",
      position: [center.lat + 0.015, center.lng - 0.01],
    },
    {
      id: 4,
      name: "Central ICU",
      type: "icu",
      position: [center.lat - 0.015, center.lng - 0.015],
    },
  ];

  // Return correct icon based on type
  const getIcon = (type) => {
    switch (type) {
      case "blood":
        return bloodIcon;
      case "hospital":
        return hospitalIcon;
      case "ambulance":
        return ambulanceIcon;
      case "icu":
        return icuIcon;
      default:
        return hospitalIcon;
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 h-[560px] z-10">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/* Map Tiles */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location */}
        <Marker position={[center.lat, center.lng]} icon={userIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>

        {/* Search Radius */}
        <Circle
          center={[center.lat, center.lng]}
          radius={radius * 1000}
          pathOptions={{
            color: "#e11d48",
            fillColor: "#fda4af",
            fillOpacity: 0.2,
          }}
        />

        {/* Resource Markers */}
        {resources.map((res) => (
          <Marker key={res.id} position={res.position} icon={getIcon(res.type)}>
            <Popup>
              <strong>{res.name}</strong>
              <br />
              Type: {res.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
