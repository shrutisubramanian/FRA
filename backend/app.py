import os, json, mimetypes
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Any, Dict, List
import google.generativeai as genai
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ----------------- PATHS AND DATA LOADING -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

with open(os.path.join(DATA_DIR, "dss_villages.json"), "r", encoding="utf-8") as f:
    VILLAGES: List[Dict[str, Any]] = json.load(f)

with open(os.path.join(DATA_DIR, "dss_schemes.json"), "r", encoding="utf-8") as f:
    SCHEMES: List[Dict[str, Any]] = json.load(f)

from rules import evaluate_scheme_for_village

# ----------------- APP SETUP -----------------
app = FastAPI(title="FRA DSS & OCR API")

# Enable CORS for local dev (Vite: 5173, CRA: 3000)
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

# ----------------- GEMINI API SETUP -----------------
YOUR_API_KEY = "AIzaSyA9qMPT7YzCd046wErm0ZNT0kUP2GX6vZc" # Replace with your actual API key
genai.configure(api_key=YOUR_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ----------------- DATABASE SETUP -----------------
DATABASE_URL = "sqlite:///./extracted_data.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()

class ExtractedData(Base):
    __tablename__ = "extracted_data"
    application_id = Column(Integer, primary_key=True, index=True, autoincrement=True) # Added autoincrement
    filename = Column(String)
    claimant_name = Column(String)
    spouse_name = Column(String)
    father_mother_name = Column(String)
    address = Column(String)
    village = Column(String)
    gram_panchayat = Column(String)
    tehsil_taluka = Column(String)
    district = Column(String)
    scheduled_tribe = Column(String)
    other_traditional_forest_dweller = Column(String)
    other_family_members = Column(Text)

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ----------------- OCR ROUTES -----------------
# Removed application_id from the URL and function signature
@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"File upload failed: {e}"})

    try:
        mime_type, _ = mimetypes.guess_type(file_location)
        if not mime_type:
            mime_type = "application/octet-stream"

        uploaded_file = genai.upload_file(path=file_location, mime_type=mime_type)

        response = model.generate_content(
            [uploaded_file,
             "Extract all fields from this document or image. "
             "1. Provide a human-readable summary. "
             "2. Also return ONLY the structured fields in pure JSON format at the end. "
             "Example:\nSummary: John Doe, 28 years old, lives in Mumbai.\nJSON: {\"name\": \"John Doe\", \"age\": \"28\", \"address\": \"Mumbai\"}"]
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"AI model processing failed: {e}"})

    output_text = response.text.strip()
    fields_data = {}

    try:
        start = output_text.find("{")
        end = output_text.rfind("}") + 1
        if start != -1 and end != -1:
            json_str = output_text[start:end]
            fields_data = json.loads(json_str)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Failed to parse JSON from AI model output: {e}"})

    try:
        db = SessionLocal()
        new_entry = ExtractedData(
            filename=file.filename,
            claimant_name=fields_data.get("claimant_name"),
            spouse_name=fields_data.get("spouse_name"),
            father_mother_name=fields_data.get("father_mother_name"),
            address=fields_data.get("address"),
            village=fields_data.get("village"),
            gram_panchayat=fields_data.get("gram_panchayat"),
            tehsil_taluka=fields_data.get("tehsil_taluka"),
            district=fields_data.get("district"),
            scheduled_tribe=fields_data.get("scheduled_tribe"),
            other_traditional_forest_dweller=fields_data.get("other_traditional_forest_dweller"),
            other_family_members=json.dumps(fields_data.get("other_family_members", []))
        )
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        db.close()
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Database write failed: {e}"})

    return JSONResponse(content={"message": "Data extracted and stored successfully.", "data": fields_data})

# ----------------- DSS ROUTES -----------------
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
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
