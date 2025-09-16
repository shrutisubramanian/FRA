# backend/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os, mimetypes, json
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUR_API_KEY = "AIzaSyA9qMPT7YzCd046wErm0ZNT0kUP2GX6vZc"
genai.configure(api_key=YOUR_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ---------------- DATABASE SETUP ----------------
DATABASE_URL = "sqlite:///./extracted_data.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Base = declarative_base()

class ExtractedData(Base):
    __tablename__ = "extracted_data"
    application_id = Column(Integer, primary_key=True, index=True)
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
    other_family_members = Column(Text) # Storing this as JSON string

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# ------------------------------------------------

@app.post("/extract-text/{application_id}")
async def extract_text(application_id: int, file: UploadFile = File(...)):
    try:
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"File upload failed: {e}"})

    try:
        # Detect mime type
        mime_type, _ = mimetypes.guess_type(file_location)
        if not mime_type:
            mime_type = "application/octet-stream"

        # Upload file
        uploaded_file = genai.upload_file(path=file_location, mime_type=mime_type)

        # Ask Gemini for structured + readable output
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

    # Try to isolate JSON part from response
    try:
        start = output_text.find("{")
        end = output_text.rfind("}") + 1
        if start != -1 and end != -1:
            json_str = output_text[start:end]
            fields_data = json.loads(json_str)
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Failed to parse JSON from AI model output: {e}"})

    # -------- Save to DB --------
    try:
        db = SessionLocal()
        new_entry = ExtractedData(
            application_id=application_id,
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
    # ----------------------------

    # Send a success message to the front-end
    return JSONResponse(content={"message": "Data extracted and stored successfully.", "data": fields_data})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)