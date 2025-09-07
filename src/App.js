// App.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// ✅ Explicit mapping: state → array of {file, type}
const stateData = {
  'Madhya Pradesh': [
    { file: 'mp_forest.geojson', type: 'forest' },
    { file: 'mp_water.geojson', type: 'water' },
    { file: 'mp_agriculture.geojson', type: 'agriculture' }
  ],
  'Telangana': [
    { file: 'ts_forest.geojson', type: 'forest' },
    { file: 'ts_water.geojson', type: 'water' },
    { file: 'ts_agriculture.geojson', type: 'agriculture' }
  ],
  'Odisha': [
    { file: 'od_forest.geojson', type: 'forest' },
    { file: 'od_water.geojson', type: 'water' },
    { file: 'od_agriculture.geojson', type: 'agriculture' }
  ],
  'Tripura': [
    { file: 'tr_forest.geojson', type: 'forest' },
    { file: 'tr_water.geojson', type: 'water' },
    { file: 'tr_agriculture.geojson', type: 'agriculture' }
  ]
};

// ✅ State center coordinates
const mapCenters = {
  'Madhya Pradesh': [22.9734, 78.6569],
  'Telangana': [17.8741, 79.2312],
  'Odisha': [20.2976, 85.8277],
  'Tripura': [23.7533, 91.7371],
};

// ✅ Styles for asset layers
const assetStyles = {
  forest: { fillColor: '#228B22', color: '#228B22', weight: 1, opacity: 0.9, fillOpacity: 0.5 },
  water: { fillColor: '#1E90FF', color: '#1E90FF', weight: 1, opacity: 0.9, fillOpacity: 0.7 },
  agriculture: { fillColor: '#daa520', color: '#daa520', weight: 1, opacity: 0.9, fillOpacity: 0.5 },
};

// ✅ Detect swapped lat/lon and fix
const looksLikeLatLon = (x, y) => {
  return x >= 6 && x <= 38 && y >= 68 && y <= 98;
};
function normalizeGeoJSON(geojson) {
  if (!geojson?.features) return geojson;
  const newFeatures = geojson.features.map((f) => {
    if (f.geometry?.type === 'Point') {
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
        if (f.geometry?.type === 'Point') {
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

  // ✅ Load GeoJSON when state is selected
  useEffect(() => {
    if (!selectedState) {
      setAssetData([]);
      return;
    }

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
    };
    loadAssets();
  }, [selectedState]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {/* State Selector */}
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          top: 10,
          left: 10,
          background: 'white',
          padding: 10,
          borderRadius: 6,
        }}
      >
        <label>Select State</label>
        <br />
        <select
          value={selectedState || ''}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">-- Select a State --</option>
          {Object.keys(stateData).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Map always visible */}
      <MapContainer
        center={[22.351114, 78.66774]} // India center
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          subdomains={['a', 'b', 'c', 'd']}
        />

        <MapUpdater stateName={selectedState} assetData={assetData} />

        {/* Render asset layers */}
        {assetData.map((asset, idx) => (
          <GeoJSON
            key={`${selectedState}-${asset.type}-${idx}`}
            data={asset.data}
            style={assetStyles[asset.type]}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: asset.type === 'water' ? 6 : 5,
                fillColor: assetStyles[asset.type].fillColor,
                color: assetStyles[asset.type].color,
                weight: 1,
                opacity: 1,
                fillOpacity: assetStyles[asset.type].fillOpacity,
              });
            }}
            onEachFeature={(feature, layer) => {
              const p = feature.properties || {};
              // ✅ Force popup to use selectedState, not file's state
              const popup = `<b>${p.name || 'Unknown'}</b><br/>
                             Type: ${p.asset_type || asset.type}<br/>
                             Area: ${p.area_ha || 'N/A'} ha<br/>
                             State: ${selectedState}`;
              layer.bindPopup(popup);
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
