import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import App from "./App.jsx";
import { LocationProvider } from "./context/LocationContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";

// Configure default base URL for API requests in production
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
