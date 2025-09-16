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
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    mime_type = Column(String)
    human_text = Column(Text)       # readable output
    fields_json = Column(Text)      # dynamic fields stored as JSON string

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# ------------------------------------------------

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

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
        fields_data = {}

    # -------- Save to DB --------
    db = SessionLocal()
    new_entry = ExtractedData(
        filename=file.filename,
        mime_type=mime_type,
        human_text=output_text,
        fields_json=json.dumps(fields_data)   # store structured fields as JSON string
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    db.close()
    # ----------------------------

    # ✅ Send human-readable text only to frontend
    return JSONResponse(content={"gemini_output": output_text})
