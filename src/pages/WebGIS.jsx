/* WebGIS.jsx */
import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Map, Layers, Leaf, Droplets, Wheat } from "lucide-react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* 1.  CONFIG CONSTANTS                                               */
/* ------------------------------------------------------------------ */
const ASSET_COLORS = { forest: "#228B22", water: "#4682B4", agriculture: "#FFD700" };

const ASSET_STYLES = {
  forest:    { fillColor: ASSET_COLORS.forest, color: ASSET_COLORS.forest, weight: 2, opacity: 1, fillOpacity: 0.5 },
  water:     { fillColor: ASSET_COLORS.water,  color: ASSET_COLORS.water,  weight: 2, opacity: 1, fillOpacity: 0.5 },
  agriculture:{fillColor: ASSET_COLORS.agriculture,color:ASSET_COLORS.agriculture,weight:2,opacity:1,fillOpacity:0.5},
};

const INITIAL_CENTER = [22.351114, 78.66774];
const INITIAL_ZOOM   = 5;

const FILE_LIST = [
  "india.geojson",
  "mp_forest.geojson",  "mp_water.geojson",  "mp_agriculture.geojson",
  "od_forest.geojson",  "od_water.geojson",  "od_agriculture.geojson",
  "tr_forest.geojson",  "tr_water.geojson",  "tr_agriculture.geojson",
  "ts_forest.geojson",  "ts_water.geojson",  "ts_agriculture.geojson",
];

/* ------------------------------------------------------------------ */
/* 2.  SMALL HELPERS                                                  */
/* ------------------------------------------------------------------ */
const fetchGeoJson = async (file) => {
  try {
    const r = await fetch(`/data/${file}`);
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    return j.features || [];
  } catch (e) {
    console.warn(`[WebGIS] skipped ${file}`, e);
    return [];
  }
};

/* popup builder ---------------------------------------------------- */
const buildPopup = ({ name, state, category, description, canopy_density, water_type, crop_type }) => `
  <div style="font-family:sans-serif;padding:6px;">
    <h4 style="margin:0 0 4px;font-size:1.1em;font-weight:bold;">${name}</h4>
    <p style="margin:0;font-size:.9em;">
      <strong>State:</strong>${state}<br/>
      <strong>Category:</strong>${category}<br/>
      ${description      ? `<strong>Description:</strong>${description}<br/>` : ""}
      ${canopy_density   ? `<strong>Canopy Density:</strong>${canopy_density}<br/>` : ""}
      ${water_type       ? `<strong>Water Type:</strong>${water_type}<br/>` : ""}
      ${crop_type        ? `<strong>Crop Type:</strong>${crop_type}<br/>` : ""}
    </p>
  </div>`;

/* style picker ----------------------------------------------------- */
const getStyle = (category) => ASSET_STYLES[category] ?? {};

/* ------------------------------------------------------------------ */
/* 3.  MAIN COMPONENT                                                 */
/* ------------------------------------------------------------------ */
export default function WebGIS() {
  /* 3-a  local state ------------------------------------------------- */
  const [geojson, setGeojson]           = useState(null); // full dataset
  const [layers, setLayers]             = useState({ forest: true, water: true, agriculture: true });
  const [states, setStates]             = useState({
    "Madhya Pradesh": true, Odisha: true, Tripura: true, Telangana: true,
  });
  const [basemap, setBasemap]           = useState("light");

  /* 3-b  load once --------------------------------------------------- */
  useEffect(() => {
    (async () => {
      const arrays = await Promise.all(FILE_LIST.map(fetchGeoJson));
      const features = arrays.flat();
      setGeojson({ type: "FeatureCollection", features });
    })();
  }, []);

  /* 3-c  filtered data (memoised) ------------------------------------ */
  const filtered = useMemo(() => {
    if (!geojson) return null;
    const f = geojson.features.filter(
      (ft) => layers[ft.properties.category] && states[ft.properties.state]
    );
    return f.length ? { ...geojson, features: f } : null;
  }, [geojson, layers, states]);

  /* 3-d  tile layer switch ------------------------------------------ */
  const tileLayer = useMemo(() => {
    switch (basemap) {
      case "satellite":
        return (
          <>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              subdomains={["a", "b", "c", "d"]}
            />
          </>
        );
      case "osm":
        return (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        );
      default: // light
        return (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors &copy; CARTO"
            subdomains={["a", "b", "c", "d"]}
          />
        );
    }
  }, [basemap]);

  /* 3-e  render ------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* header ------------------------------------------------------- */}
      <section
        className="py-12 md:py-16 lg:py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(53,149,53,.9),rgba(38,121,38,.9)),url(https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=600&fit=crop)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Map className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">WebGIS Asset Mapping</h1>
            <p className="text-xl text-green-100">Interactive mapping for resource management across Indian states.</p>
          </motion.div>
        </div>
      </section>

      {/* main ---------------------------------------------------------- */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* sidebar ------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Data</h2>

                {/* categories ------------------------------------------ */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Asset Categories</h3>
                    <Layers className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    {Object.keys(layers).map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={layers[cat]}
                          onChange={(e) => setLayers((s) => ({ ...s, [cat]: e.target.checked }))}
                          className="form-checkbox h-5 w-5 rounded"
                          style={{ accentColor: ASSET_COLORS[cat] }}
                        />
                        {cat === "forest" && <Leaf      className="h-5 w-5" style={{ color: ASSET_COLORS.forest }} />}
                        {cat === "water" &&  <Droplets  className="h-5 w-5" style={{ color: ASSET_COLORS.water }} />}
                        {cat === "agriculture" && <Wheat className="h-5 w-5" style={{ color: ASSET_COLORS.agriculture }} />}
                        <span className="text-gray-700 font-medium capitalize">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* states ---------------------------------------------- */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">States</h3>
                  <div className="space-y-2">
                    {Object.keys(states).map((st) => (
                      <label
                        key={st}
                        className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={states[st]}
                          onChange={(e) => setStates((s) => ({ ...s, [st]: e.target.checked }))}
                          className="form-checkbox h-5 w-5 text-gray-600 rounded"
                        />
                        <span className="text-gray-700 font-medium">{st}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* basemap --------------------------------------------- */}
                <div>
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

            {/* map --------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px] relative">
                {!geojson ? (
                  <div className="flex items-center justify-center h-full text-gray-500">Loading layers…</div>
                ) : (
                  <MapContainer center={INITIAL_CENTER} zoom={INITIAL_ZOOM} style={{ height: "100%", width: "100%" }}>
                    {tileLayer}
                    {filtered && (
                      <GeoJSON
                        key={JSON.stringify(filtered)} // force re-mount when filter changes
                        data={filtered}
                        style={(ft) => getStyle(ft.properties.category)}
                        onEachFeature={(ft, layer) => layer.bindPopup(buildPopup(ft.properties))}
                      />
                    )}

                    {/* legend -------------------------------------- */}
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
                      <div className="font-semibold text-gray-900 mb-2">Legend</div>
                      <div className="space-y-1">
                        {Object.entries(ASSET_COLORS).map(([k, v]) => (
                          <div key={k} className="flex items-center space-x-2">
                            <div className="w-3 h-3" style={{ backgroundColor: v }} />
                            <span className="text-gray-700 capitalize">{k}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MapContainer>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}