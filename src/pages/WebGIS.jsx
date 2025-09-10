import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Map,
  ChevronRight,
  X,
  Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 1.  CONFIG (all inline now)                                         */
/* ------------------------------------------------------------------ */
// ✅ State → array of {file, type, label}
const stateData = {
  "Madhya Pradesh": [
    { file: "mp_forest.geojson", type: "forest", label: "Forest" },
    { file: "mp_water.geojson", type: "water", label: "Water" },
    { file: "mp_agriculture.geojson", type: "agriculture", label: "Agriculture" },
  ],
  Telangana: [
    { file: "ts_forest.geojson", type: "forest", label: "Forest" },
    { file: "ts_water.geojson", type: "water", label: "Water" },
    { file: "ts_agriculture.geojson", type: "agriculture", label: "Agriculture" },
  ],
  Odisha: [
    { file: "od_forest.geojson", type: "forest", label: "Forest" },
    { file: "od_water.geojson", type: "water", label: "Water" },
    { file: "od_agriculture.geojson", type: "agriculture", label: "Agriculture" },
  ],
  Tripura: [
    { file: "tr_forest.geojson", type: "forest", label: "Forest" },
    { file: "tr_water.geojson", type: "water", label: "Water" },
    { file: "tr_agriculture.geojson", type: "agriculture", label: "Agriculture" },
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

// ✅ Asset metadata for cards
const assetTypes = [
  {
    type: "forest",
    label: "Forest",
    unit: "hectares",
    icon: (props) => <div {...props} style={{ color: "#228B22" }}>🌲</div>,
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=60",
  },
  {
    type: "water",
    label: "Water",
    unit: "hectares",
    icon: (props) => <div {...props} style={{ color: "#1E90FF" }}>💧</div>,
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=60",
  },
  {
    type: "agriculture",
    label: "Agriculture",
    unit: "hectares",
    icon: (props) => <div {...props} style={{ color: "#daa520" }}>🌾</div>,
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=60",
  },
];

/* Normalize GeoJSON coordinates (fix swapped lat/lon if needed) */
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

/* ------------------------------------------------------------------ */
/* 2.  MAP UPDATER                                                     */
/* ------------------------------------------------------------------ */
const MapUpdater = ({ stateName, assetData }) => {
  const map = useMap();
  useEffect(() => {
    if (!stateName) return;

    if (mapCenters[stateName]) {
      map.flyTo(mapCenters[stateName], 7, { animate: true });
    }

    const coords = [];
    assetData.forEach((a) => {
      a?.data?.features?.forEach((f) => {
        if (f.geometry?.type === "Point") {
          const [lon, lat] = f.geometry.coordinates;
          coords.push([lat, lon]);
        }
      });
    });

    if (coords.length) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds.pad(0.25), { animate: true, maxZoom: 12 });
    }
  }, [map, stateName, assetData]);
  return null;
};

/* ------------------------------------------------------------------ */
/* 3.  MAIN COMPONENT                                                  */
/* ------------------------------------------------------------------ */
const WebGIS = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [assetData, setAssetData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [visibleLayers, setVisibleLayers] = useState({
    forest: true,
    water: true,
    agriculture: true,
  });

  // ✅ default basemap = light
  const [basemap, setBasemap] = useState("light");

  const [isStatesPanelOpen, setIsStatesPanelOpen] = useState(false);

  /* ---------- Load Data ---------- */
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
          const url = `${import.meta.env.BASE_URL}data/${file}`;
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

  /* ---------- Derived stats ---------- */
  const totalAssets = assetTypes.reduce((acc, asset) => {
    const geojson = assetData.find((d) => d.type === asset.type)?.data;
    acc[asset.type] = geojson?.features?.length || 0;
    return acc;
  }, {});

  /* ---------- Handlers ---------- */
  const handleStateSelect = (state) => {
    setSelectedState(state);
    setIsStatesPanelOpen(false);
  };

  const getAssetIcon = (type) => {
    const asset = assetTypes.find((a) => a.type === type);
    return asset ? asset.icon : null;
  };

  /* ================================================================== */
  /*  UI                                                                */
  /* ================================================================== */
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <section
        className="py-12 md:py-16 lg:py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(53, 149, 53, 0.9), rgba(38, 121, 38, 0.9)), url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=600&fit=crop')`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Map className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              WebGIS Asset Mapping
            </h1>
            <p className="text-xl text-green-100">
              Interactive mapping for resource management across Indian states.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Explore Data
                </h2>

                {/* States Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">
                      Select a State
                    </h3>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        isStatesPanelOpen ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                  <div
                    onClick={() => setIsStatesPanelOpen(!isStatesPanelOpen)}
                    className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-green-500 transition-colors"
                  >
                    <span className="text-gray-700 font-medium">
                      {selectedState || "Select a State..."}
                    </span>
                    {selectedState && (
                      <X
                        className="h-4 w-4 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedState(null);
                        }}
                      />
                    )}
                  </div>
                  {isStatesPanelOpen && (
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-2 border border-gray-200">
                      {Object.keys(stateData).map((s) => (
                        <div
                          key={s}
                          onClick={() => handleStateSelect(s)}
                          className={`p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedState === s
                              ? "bg-green-100 text-green-800 font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Layers Control */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Layers</h3>
                    <Layers className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    {Object.keys(visibleLayers).map((layerType) => {
                      const LayerIcon = getAssetIcon(layerType);
                      const label =
                        layerType.charAt(0).toUpperCase() + layerType.slice(1);
                      return (
                        <div
                          key={layerType}
                          className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 border border-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={visibleLayers[layerType] || false}
                            onChange={() =>
                              setVisibleLayers({
                                ...visibleLayers,
                                [layerType]: !visibleLayers[layerType],
                              })
                            }
                            className="form-checkbox h-5 w-5 text-green-600 rounded"
                          />
                          {LayerIcon && (
                            <LayerIcon className="h-5 w-5 text-gray-700" />
                          )}
                          <span className="text-gray-700 font-medium">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ✅ Basemap Dropdown */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Basemap</h3>
                  <select
                    value={basemap}
                    onChange={(e) => setBasemap(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  >
                    <option value="light">Light (Carto)</option>
                    <option value="satellite">Satellite (Esri)</option>
                    <option value="osm">OSM Standard</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] relative">
                {loading && (
                  <div className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 rounded-lg py-2 px-4 shadow-lg flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700"></div>
                    <span className="text-sm font-medium text-green-700">
                      Loading assets...
                    </span>
                  </div>
                )}

                <MapContainer
                  center={[22.351114, 78.66774]}
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
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                      />
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

                  {/* Render GeoJSON layers */}
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
                                  fillOpacity:
                                    assetStyles[asset.type].fillOpacity,
                                })
                              }
                              onEachFeature={(feature, layer) => {
                                const p = feature.properties || {};
                                layer.bindPopup(`
                                  <div style="font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.5;">
                                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px;">${
                                      p.name || "Unknown"
                                    }</div>
                                    <div style="color: #6b7280; margin-bottom: 4px;"><strong>Type:</strong> ${
                                      p.asset_type || asset.type
                                    }</div>
                                    <div style="color: #6b7280; margin-bottom: 4px;"><strong>Area:</strong> ${
                                      p.area_ha || "N/A"
                                    } ha</div>
                                    <div style="color: #6b7280;"><strong>State:</strong> ${selectedState}</div>
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
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
                  <div className="font-semibold text-gray-900 mb-2">
                    Legend
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <span className="text-gray-700">Forest</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-gray-700">Water</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                      <span className="text-gray-700">Agriculture</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Asset Cards */}
          {selectedState && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {assetTypes.map((asset, index) => (
                <div
                  key={asset.type}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div
                    className="h-32 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${asset.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <asset.icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {asset.label}
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {totalAssets[asset.type]?.toFixed(2) || 0}
                    </p>
                    <p className="text-sm text-gray-600">{asset.unit}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WebGIS;
