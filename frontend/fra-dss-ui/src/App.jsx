import { useEffect, useState } from "react";
import Modal from "react-modal";

const API_BASE = "http://127.0.0.1:8000";
Modal.setAppElement("#root");

export default function App() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [selectedVillage, setSelectedVillage] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [eligLoading, setEligLoading] = useState(false);
  const [eligErr, setEligErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/villages`);
        if (!res.ok) throw new Error(`Failed /villages: ${res.status}`);
        const data = await res.json();
        setVillages(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onVillageClick = async (v) => {
    setSelectedVillage(v);
    setEligLoading(true);
    setEligErr(null);
    setCardOpen(true);
    try {
      const res = await fetch(`${API_BASE}/village/${v.village_id}/eligibility`);
      if (!res.ok) throw new Error(`Failed eligibility: ${res.status}`);
      const data = await res.json();
      setEligibility(data);
    } catch (e) {
      setEligErr(e.message);
    } finally {
      setEligLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading villages…</div>;
  if (err) return <div style={{ padding: 24, color: "crimson" }}>Error: {err}</div>;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>FRA DSS – Villages</h1>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Click a village to view eligible schemes.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {villages.map((v) => (
          <div
            key={v.village_id}
            onClick={() => onVillageClick(v)}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 14,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontWeight: 700 }}>{v.village_name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {v.state} • {v.district}
            </div>
            <div style={{ marginTop: 8, fontSize: 12 }}>
              Pop: {v.population} • ST%: {v.pct_st_population}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={cardOpen}
        onRequestClose={() => setCardOpen(false)}
        style={{
          content: {
            maxWidth: 760,
            maxHeight: "80vh",      // ⬅️ Limit modal height
            overflowY: "auto",      // ⬅️ Enable vertical scroll
            inset: "10% auto auto 50%",
            transform: "translateX(-50%)",
            borderRadius: 14,
            padding: 0,             // let header/content manage padding
          },
          overlay: { background: "rgba(0,0,0,0.35)" },
        }}
      >
        <div>
          {/* Sticky Header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              padding: "12px 20px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>
              {selectedVillage ? selectedVillage.village_name : "Village"}
            </h2>
            <button
              onClick={() => setCardOpen(false)}
              style={{
                fontSize: 18,
                padding: "4px 10px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: 20 }}>
            {eligLoading && <div>Loading eligibility…</div>}
            {eligErr && <div style={{ color: "crimson" }}>Error: {eligErr}</div>}

            {eligibility && !eligLoading && !eligErr && (
              <div>
                <div style={{ marginBottom: 8, color: "#333" }}>
                  Eligible schemes:{" "}
                  <b>{eligibility.eligible_schemes.length}</b>
                </div>

                {eligibility.eligible_schemes.length === 0 && (
                  <div style={{ color: "#666" }}>No schemes matched.</div>
                )}

                <div style={{ display: "grid", gap: 10 }}>
                  {eligibility.eligible_schemes.map((s) => (
                    <div
                      key={s.scheme_id}
                      style={{
                        border: "1px solid #e5e5e5",
                        borderRadius: 10,
                        padding: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{s.scheme_name}</div>
                      {s.benefit && (
                        <div style={{ fontSize: 12, color: "#333" }}>
                          {s.benefit}
                        </div>
                      )}
                      {s.eligibility_human && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#666",
                            marginTop: 6,
                          }}
                        >
                          {s.eligibility_human}
                        </div>
                      )}

                      <details style={{ marginTop: 8 }}>
                        <summary style={{ cursor: "pointer" }}>
                          Why matched?
                        </summary>
                        <ul style={{ marginTop: 6 }}>
                          {s.matched_conditions.map((c, idx) => (
                            <li key={idx} style={{ fontSize: 12 }}>
                              <code>
                                {c.field} {c.op} {JSON.stringify(c.value)}
                              </code>
                              {" → village has "}
                              <code>{JSON.stringify(c.village_value)}</code>
                              {c.skipped_by_applies_if
                                ? " (applies_if skipped)"
                                : c.matched
                                ? " ✅"
                                : " ❌"}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
