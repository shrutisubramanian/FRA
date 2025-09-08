import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { Map, TreePine, Droplets, Wheat, Users } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WebGIS = () => {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    // Mock data for villages
    const mockVillages = [
      {
        id: 1,
        name: 'Devgaon',
        position: [20.7516, 78.8371],
        population: 1200,
        assets: {
          forests: 450,
          waterBodies: 12,
          farmland: 280
        },
        boundary: [
          [20.7516, 78.8371],
          [20.7556, 78.8411],
          [20.7546, 78.8451],
          [20.7506, 78.8441],
          [20.7496, 78.8401]
        ]
      },
      {
        id: 2,
        name: 'Bambarda',
        position: [20.7616, 78.8471],
        population: 850,
        assets: {
          forests: 320,
          waterBodies: 8,
          farmland: 190
        },
        boundary: [
          [20.7616, 78.8471],
          [20.7656, 78.8511],
          [20.7646, 78.8551],
          [20.7606, 78.8541],
          [20.7596, 78.8501]
        ]
      },
      {
        id: 3,
        name: 'Kondegaon',
        position: [20.7416, 78.8571],
        population: 1500,
        assets: {
          forests: 520,
          waterBodies: 15,
          farmland: 340
        },
        boundary: [
          [20.7416, 78.8571],
          [20.7456, 78.8611],
          [20.7446, 78.8651],
          [20.7406, 78.8641],
          [20.7396, 78.8601]
        ]
      }
    ];
    setVillages(mockVillages);
  }, []);

  const assetTypes = [
    { type: 'forests', label: 'Forest Area', icon: TreePine, color: 'text-forest-600', unit: 'hectares' },
    { type: 'waterBodies', label: 'Water Bodies', icon: Droplets, color: 'text-sky-600', unit: 'count' },
    { type: 'farmland', label: 'Farmland', icon: Wheat, color: 'text-earth-600', unit: 'hectares' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section 
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(53, 149, 53, 0.9), rgba(38, 121, 38, 0.9)), url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=600&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Map className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              WebGIS Asset Mapping
            </h1>
            <p className="text-xl text-forest-100">
              Interactive mapping system for forest assets, village boundaries, and resource management
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
                <h2 className="text-xl font-bold text-gray-900 mb-6">Villages</h2>
                
                <div className="space-y-4">
                  {villages.map((village) => (
                    <motion.div
                      key={village.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedVillage(village)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedVillage?.id === village.id
                          ? 'border-forest-500 bg-forest-50'
                          : 'border-gray-200 hover:border-forest-300 hover:bg-forest-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-forest-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{village.name}</h3>
                          <p className="text-sm text-gray-600">{village.population} people</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedVillage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4">{selectedVillage.name} Assets</h3>
                    <div className="space-y-3">
                      {assetTypes.map((asset) => (
                        <div key={asset.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <asset.icon className={`h-4 w-4 ${asset.color}`} />
                            <span className="text-sm text-gray-700">{asset.label}</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedVillage.assets[asset.type]} {asset.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[600px]">
                <MapContainer
                  center={[20.7516, 78.8371]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {villages.map((village) => (
                    <React.Fragment key={village.id}>
                      <Marker
                        position={village.position}
                        eventHandlers={{
                          click: () => setSelectedVillage(village)
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{village.name}</h3>
                            <p className="text-sm text-gray-600">Population: {village.population}</p>
                            <div className="mt-2 space-y-1">
                              {assetTypes.map((asset) => (
                                <div key={asset.type} className="flex justify-between text-xs">
                                  <span>{asset.label}:</span>
                                  <span>{village.assets[asset.type]} {asset.unit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                      
                      {selectedVillage?.id === village.id && (
                        <Polygon
                          positions={village.boundary}
                          pathOptions={{
                            color: '#359535',
                            fillColor: '#359535',
                            fillOpacity: 0.2,
                            weight: 3
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </motion.div>
          </div>

          {/* Asset Cards */}
          {selectedVillage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {assetTypes.map((asset, index) => (
                <div
                  key={asset.type}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div 
                    className="h-32 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url(${
                        asset.type === 'forests' 
                          ? 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop'
                          : asset.type === 'waterBodies'
                          ? 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop'
                          : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop'
                      })`
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <asset.icon className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.label}</h3>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {selectedVillage.assets[asset.type]}
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
