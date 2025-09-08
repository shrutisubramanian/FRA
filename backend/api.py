# backend/api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List
import os, json

from rules import evaluate_scheme_for_village

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

with open(os.path.join(DATA_DIR, "dss_villages.json"), "r", encoding="utf-8") as f:
    VILLAGES: List[Dict[str, Any]] = json.load(f)

with open(os.path.join(DATA_DIR, "dss_schemes.json"), "r", encoding="utf-8") as f:
    SCHEMES: List[Dict[str, Any]] = json.load(f)


app = FastAPI(title="FRA DSS API")


# CORS for local dev (Vite: 5173, CRA: 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:3000", "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/villages")
def list_villages():
    return VILLAGES

@app.get("/schemes")
def list_schemes():
    return SCHEMES

@app.get("/village/{village_id}/eligibility")
def eligibility(village_id: str):
    v = next((x for x in VILLAGES if x.get("village_id") == village_id), None)
    if not v:
        return {"error": f"Village {village_id} not found"}

    eligible_schemes = []
    not_eligible = []

    for s in SCHEMES:
        ok, details = evaluate_scheme_for_village(v, s)
        record = {
            "scheme_id": s.get("scheme_id"),
            "scheme_name": s.get("scheme_name"),
            "benefit": s.get("benefit"),
            "eligibility_human": s.get("eligibility_human"),
            "matched_conditions": details
        }
        if ok:
            eligible_schemes.append(record)
        else:
            not_eligible.append(record)

    return {
        "village": v,
        "eligible_schemes": eligible_schemes,
        "not_eligible_schemes": not_eligible
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
