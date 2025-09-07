// App.js
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// ✅ Explicit mapping: state → array of {file, type}
const stateData = {
  "Madhya Pradesh": [
    { file: "mp_forest.geojson", type: "forest" },
    { file: "mp_water.geojson", type: "water" },
    { file: "mp_agriculture.geojson", type: "agriculture" },
  ],
  Telangana: [
    { file: "ts_forest.geojson", type: "forest" },
    { file: "ts_water.geojson", type: "water" },
    { file: "ts_agriculture.geojson", type: "agriculture" },
  ],
  Odisha: [
    { file: "od_forest.geojson", type: "forest" },
    { file: "od_water.geojson", type: "water" },
    { file: "od_agriculture.geojson", type: "agriculture" },
  ],
  Tripura: [
    { file: "tr_forest.geojson", type: "forest" },
    { file: "tr_water.geojson", type: "water" },
    { file: "tr_agriculture.geojson", type: "agriculture" },
  ],
};

// ✅ State center coordinates
const mapCenters = {
  "Madhya Pradesh": [22.9734, 78.6569],
  Telangana: [17.8741, 79.2312],
  Odisha: [20.2976, 85.8277],
  Tripura: [23.7533, 91.7371],
};

// ✅ Styles for asset layers
const assetStyles = {
  forest: {
    fillColor: "#228B22",
    color: "#228B22",
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.5,
  },
  water: {
    fillColor: "#1E90FF",
    color: "#1E90FF",
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.7,
  },
  agriculture: {
    fillColor: "#daa520",
    color: "#daa520",
    weight: 1,
    opacity: 0.9,
    fillOpacity: 0.5,
  },
};

// ✅ Detect swapped lat/lon and fix
const looksLikeLatLon = (x, y) => x >= 6 && x <= 38 && y >= 68 && y <= 98;
function normalizeGeoJSON(geojson) {
  if (!geojson?.features) return geojson;
  const newFeatures = geojson.features.map((f) => {
    if (f.geometry?.type === "Point") {
      const [a, b] = f.geometry.coordinates;
      if (looksLikeLatLon(a, b)) {
        f.geometry.coordinates = [b, a]; // swap to [lon,lat]
      }
    }
    return f;
  });
  return { ...geojson, features: newFeatures };
}

// ✅ Zoom handler
const MapUpdater = ({ stateName, assetData }) => {
  const map = useMap();
  useEffect(() => {
    if (!stateName) return;

    // fly to state center
    if (mapCenters[stateName]) {
      map.flyTo(mapCenters[stateName], 7, { animate: true });
    }

    // fit to loaded asset points
    const coords = [];
    assetData.forEach((a) => {
      a?.data?.features?.forEach((f) => {
        if (f.geometry?.type === "Point") {
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        }
      });
    });

    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds.pad(0.25), { animate: true, maxZoom: 12 });
    }
  }, [map, stateName, assetData]);
  return null;
};

const App = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [assetData, setAssetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    forest: true,
    water: true,
    agriculture: true,
  });
  const [basemap, setBasemap] = useState("light");

  // ✅ Load GeoJSON when state is selected
  useEffect(() => {
    if (!selectedState) {
      setAssetData([]);
      return;
    }
    setAssetData([]);
    setLoading(true);
    const loadAssets = async () => {
      const assets = stateData[selectedState];
      const results = await Promise.all(
        assets.map(async ({ file, type }) => {
          const url = `${process.env.PUBLIC_URL}/data/${file}`;
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const normalized = normalizeGeoJSON(json);
            return { type, data: normalized };
          } catch (err) {
            console.error(`Failed to fetch ${file}:`, err);
            return null;
          }
        })
      );
      setAssetData(results.filter(Boolean));
      setLoading(false);
    };
    loadAssets();
  }, [selectedState]);

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#f8f9fa",
          padding: "16px",
          borderRight: "1px solid #ddd",
          fontFamily: "Arial",
        }}
      >
        <h3 style={{ marginTop: 0 }}>🌍 FRA Atlas MVP</h3>

        <label style={{ display: "block", marginTop: "10px" }}>
          Select State
        </label>
        <select
          value={selectedState || ""}
          onChange={(e) => setSelectedState(e.target.value || null)}
          style={{ width: "100%", marginBottom: "10px", padding: "6px" }}
        >
          <option value="">-- Select a State --</option>
          {Object.keys(stateData).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div>
          <label>
            <b>Layers</b>
          </label>
          {Object.keys(visibleLayers).map((layer) => (
            <div key={layer}>
              <input
                type="checkbox"
                checked={visibleLayers[layer]}
                onChange={() =>
                  setVisibleLayers({
                    ...visibleLayers,
                    [layer]: !visibleLayers[layer],
                  })
                }
              />{" "}
              {layer.charAt(0).toUpperCase() + layer.slice(1)}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "10px" }}>
          <label>
            <b>Basemap</b>
          </label>
          <select
            value={basemap}
            onChange={(e) => setBasemap(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
          >
            <option value="light">Light (Carto)</option>
            <option value="satellite">Satellite (Esri)</option>
            <option value="osm">OSM Standard</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flexGrow: 1, position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "white",
              padding: "6px 10px",
              borderRadius: "4px",
              zIndex: 1000,
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            }}
          >
            Loading assets...
          </div>
        )}

        <MapContainer
          center={[22.351114, 78.66774]} // India center
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          {/* Basemap switch */}
          {basemap === "light" && (
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              subdomains={["a", "b", "c", "d"]}
            />
          )}

          {basemap === "satellite" && (
            <>
              {/* Esri satellite imagery */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              />
              {/* Transparent progressive labels (country → state → district) */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                subdomains={["a", "b", "c", "d"]}
              />
            </>
          )}

          {basemap === "osm" && (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          )}

          <MapUpdater stateName={selectedState} assetData={assetData} />

          {assetData.length > 0 && (
            <React.Fragment key={selectedState}>
              {assetData.map(
                (asset, idx) =>
                  visibleLayers[asset.type] && (
                    <GeoJSON
                      key={`${asset.type}-${idx}`}
                      data={asset.data}
                      style={assetStyles[asset.type]}
                      pointToLayer={(feature, latlng) =>
                        L.circleMarker(latlng, {
                          radius: asset.type === "water" ? 6 : 5,
                          fillColor: assetStyles[asset.type].fillColor,
                          color: assetStyles[asset.type].color,
                          weight: 1,
                          opacity: 1,
                          fillOpacity: assetStyles[asset.type].fillOpacity,
                        })
                      }
                      onEachFeature={(feature, layer) => {
                        const p = feature.properties || {};
                        layer.bindPopup(`
                          <div style="font-size:13px">
                            <b>${p.name || "Unknown"}</b><br/>
                            <b>Type:</b> ${p.asset_type || asset.type}<br/>
                            <b>Area:</b> ${p.area_ha || "N/A"} ha<br/>
                            <b>State:</b> ${selectedState}
                          </div>
                        `);
                      }}
                    />
                  )
              )}
            </React.Fragment>
          )}
        </MapContainer>

        {/* Legend */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            background: "white",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "13px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          }}
        >
          <div>
            <span style={{ color: "#228B22" }}>●</span> Forest
          </div>
          <div>
            <span style={{ color: "#1E90FF" }}>●</span> Water
          </div>
          <div>
            <span style={{ color: "#daa520" }}>●</span> Agriculture
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
