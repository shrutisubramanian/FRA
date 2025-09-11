import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3 } from "lucide-react";

const API_BASE = "http://127.0.0.1:8001";

/* ----------  SVG icons  ---------- */
const IconUsers = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
const IconHome = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><path d="M9 22V12h6v10" /></svg>;
const IconDrop = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" /></svg>;
const IconLeaf = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M20 6c-2.4 0-4.6.9-6.3 2.3C12.3 5.4 10.2 4 8 4 4.1 4 1 6.8 1 10.5 1 15.2 6 20 12 22c6-2 11-6.8 11-11.5C23 8.7 21.8 6 20 6z" /></svg>;
const IconInfo = () => <svg width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconMapPin = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconTrendingUp = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="m23 6-6.5 6.5-3.5-3.5L3 19"></path><path d="m17 6 6 0 0 6"></path></svg>;
const IconAward = () => <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"></circle><path d="m9 21 3-9 3 9"></path><path d="m6 15 1.5-7.5"></path><path d="m18 15-1.5-7.5"></path></svg>;

/* ----------  stats overview  ---------- */
function StatsOverview({ villages }) {
  const totalPopulation = villages.reduce((sum, v) => sum + v.population, 0);
  const avgForestCover = villages.length > 0 ? villages.reduce((sum, v) => sum + v.pct_forest_cover, 0) / villages.length : 0;
  const cfrVillages = villages.filter(v => v.has_cfr).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <IconTrendingUp />
        Overview Statistics
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">{villages.length}</div>
          <div className="text-sm text-blue-600">Total Villages</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-700">{totalPopulation.toLocaleString()}</div>
          <div className="text-sm text-green-600">Total Population</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-2xl font-bold text-orange-700">{avgForestCover.toFixed(1)}%</div>
          <div className="text-sm text-orange-600">Avg Forest Cover</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-2xl font-bold text-purple-700">{cfrVillages}</div>
          <div className="text-sm text-purple-600">CFR Available</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------  popover  ---------- */
function MatchedPopover({ conditions }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    const onKey = e => e.key === "Escape" && setOpen(false);
    const onClick = e => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current && !popRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { 
      document.removeEventListener("mousedown", onClick); 
      document.removeEventListener("keydown", onKey); 
    };
  }, []);

  const [pos, setPos] = useState({});
  useEffect(() => {
    if (!open) return;
    const rect = btnRef.current.getBoundingClientRect();
    const popH = 220;
    const fitsAbove = rect.top > popH + 16;
    const top = fitsAbove ? rect.top - 8 : rect.bottom + 8;
    const transform = fitsAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";
    setPos({ position: "fixed", left: rect.left + rect.width / 2, top, transform, zIndex: 50 });
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="text-xs text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer inline-flex items-center gap-1 transition-colors"
      >
        <IconInfo /> Why matched?
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            style={pos}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="w-80"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-56 overflow-y-auto shadow-xl text-xs text-gray-600">
              {conditions.map((c, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 rounded border-l-4 border-blue-200">
                  <div className="flex items-center justify-between">
                    <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                      {c.field} {c.op} {JSON.stringify(c.value)}
                    </code>
                    <span className={`text-xs ${c.matched ? 'text-green-600' : 'text-red-600'}`}>
                      {c.matched ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-600">
                    Village has: <code className="bg-gray-200 px-1 rounded">{JSON.stringify(c.village_value)}</code>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------  village card  ---------- */
function VillageCard({ v, open, onClick, recLoading, recommendations }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="group"
    >
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
        onClick={onClick}
      >
        {/* Header with optional image */}
        <div
          className="h-40 relative overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-green-600"
          style={v.image_url ? { backgroundImage: `url(${v.image_url})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <IconMapPin className="w-8 h-8 mb-2 opacity-90" />
            <h3 className="text-lg font-bold text-center px-4">{v.village_name}</h3>
            <p className="text-sm opacity-90">{v.district}, {v.state}</p>
          </div>
          {v.has_cfr && (
            <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              CFR Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <IconUsers className="w-4 h-4" />
              <span className="font-medium">{v.population.toLocaleString()}</span>
              <span className="text-sm">residents</span>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              {v.pct_st_population}% ST
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <IconHome className="w-4 h-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">{v.pct_pucca_houses}%</div>
                <div className="text-xs text-gray-600">Pucca Houses</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <IconDrop className="w-4 h-4 text-cyan-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">{v.fhtc_coverage_pct}%</div>
                <div className="text-xs text-gray-600">FHTC Coverage</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <IconLeaf className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">{v.pct_forest_cover}%</div>
                <div className="text-xs text-gray-600">Forest Cover</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <IconAward className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">{v.num_fra_patta_holders}</div>
                <div className="text-xs text-gray-600">FRA Holders</div>
              </div>
            </div>
          </div>

          <button 
            disabled={recLoading && open} 
            className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              recLoading && open 
                ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                : open 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {open ? (recLoading ? "Analyzing..." : "Hide Analysis") : "Get AI Analysis"}
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          >
            <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              {recLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Analyzing village eligibility...</span>
                  </div>
                </div>
              ) : recommendations ? (
                <div className="p-6">
                  <h4 className="text-lg font-bold text-green-700 mb-4">Eligible Schemes</h4>
                  {recommendations.eligible_schemes?.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.eligible_schemes.map(s => (
                        <div key={s.scheme_id} className="border-l-4 border-green-500 bg-green-50 rounded-r-lg p-4">
                          <h5 className="font-semibold text-green-800 mb-1">{s.scheme_name}</h5>
                          <p className="text-sm text-green-700 mb-2">{s.benefit}</p>
                          {s.matched_conditions && <MatchedPopover conditions={s.matched_conditions} />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-green-600 bg-green-50 p-4 rounded-lg">No schemes available</div>
                  )}
                  {recommendations.not_eligible_schemes?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-red-700 mb-4">Not Eligible</h4>
                      {recommendations.not_eligible_schemes.slice(0, 3).map(s => (
                        <div key={s.scheme_id} className="border-l-4 border-red-300 bg-red-50 rounded-r-lg p-4">
                          <h5 className="font-semibold text-red-800 mb-1">{s.scheme_name}</h5>
                          <p className="text-sm text-red-700">{s.eligibility_human}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">Failed to load recommendations.</div>
              )}
              <button
                onClick={onClick}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ----------  main component  ---------- */
export default function DSS() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/villages`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setVillages)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fetchRec = async (id) => {
    if (selectedId === id) { 
      setSelectedId(null); 
      setRecommendations(null);
      return; 
    }
    setSelectedId(id);
    setRecLoading(true);
    setRecommendations(null);
    try {
      const r = await fetch(`${API_BASE}/village/${id}/eligibility`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setRecommendations(d);
    } catch (e) {
      console.error('Failed:', e);
      setRecommendations({ eligible_schemes: [], not_eligible_schemes: [] });
    } finally {
      setRecLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 0.9)), url('https://images.unsplash.com/photo-1503264116251-35a269479413?w=1920&h=600&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BarChart3 className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              FRA Decision Support System
            </h1>
            <p className="text-xl text-blue-100">
              Village eligibility analysis and scheme recommendations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <StatsOverview villages={villages} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {villages.map(v => (
            <VillageCard
              key={v.village_id}
              v={v}
              open={selectedId === v.village_id}
              onClick={() => fetchRec(v.village_id)}
              recLoading={recLoading && selectedId === v.village_id}
              recommendations={selectedId === v.village_id ? recommendations : null}
            />
          ))}
        </motion.div>
        {villages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No villages found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
