import React from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoJsonData from "./india_states.geojson"; // Make sure this file is correctly placed in your project

function App() {
  const fraData = [
    { state: "Telangana", coords: [17.1232, 79.2088], holder: "Ravi Kumar - Adilabad" },
    { state: "Madhya Pradesh", coords: [22.9734, 78.6569], holder: "Sita Devi - Mandla" },
    { state: "Tripura", coords: [23.9408, 91.9882], holder: "Bimal Das - West Tripura" },
    { state: "Odisha", coords: [20.9517, 85.0985], holder: "Laxmi Nayak - Kandhamal" },
    { state: "Jammu & Kashmir", coords: [33.277839, 75.341218], holder: "Kiran Sharma - Jammu" },
  ];

  const disputedAreas = [
    { name: "Spanggur Gap", coords: [33.5575, 78.732] },
    { name: "Siachen Glacier", coords: [35.421111, 77.109444] },
    { name: "Dhola Post", coords: [27.818056, 91.673611] },
    { name: "Barahoti Plains", coords: [30.8333, 79.9667] },
  ];

  const INDIA_BOUNDS = [
    [6.44, 68.11], // Southern and western extent of India
    [35.51, 97.24], // Northern and eastern extent of India
  ];

  // List of Indian states and Union Territories (post-2019)
  const indianRegions = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h2 style={{ textAlign: "center" }}>
        🌍 FRA WebGIS Prototype (India Only: 4 States + J&K + Disputed Areas)
      </h2>

      <MapContainer
        bounds={INDIA_BOUNDS}
        maxBounds={INDIA_BOUNDS}
        maxBoundsViscosity={1.0}
        center={[22.5, 82]}
        zoom={5}
        style={{ height: "90%", width: "100%" }}
        maxZoom={10} // Restrict zooming out to prevent seeing other countries
        minZoom={5}  // Ensure India fills the view
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          noWrap={true}
        />

        {/* FRA Patta Holders Markers */}
        {fraData.map((item, index) => (
          <Marker key={index} position={item.coords}>
            <Popup>
              <strong>{item.state}</strong> <br />
              {item.holder}
            </Popup>
          </Marker>
        ))}

        {/* Disputed Areas Markers */}
        {disputedAreas.map((area, index) => (
          <Marker key={index} position={area.coords}>
            <Popup>
              ⚠️ <strong>Disputed Area</strong> <br />
              {area.name}
            </Popup>
          </Marker>
        ))}

        {/* Indian States and Union Territories Boundary */}
        <GeoJSON
          data={geoJsonData}
          filter={(feature) =>
            feature.properties && indianRegions.includes(feature.properties.st_nm)
          }
          style={{
            color: "black",
            weight: 2,
            fillOpacity: 0,
          }}
        />
      </MapContainer>
    </div>
  );
}

export default App;