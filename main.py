from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Configure Gemini
genai.configure(api_key="AIzaSyDQ9LCPxLMEJfb3rCvWUB9YAIkxxyOoYc4") 
model = genai.GenerativeModel("gemini-1.5-flash")

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    # Save file temporarily
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # ✅ Upload file directly to Gemini
    uploaded_file = genai.upload_file(file_location)

    # Ask Gemini to extract/summarize
    response = model.generate_content(
        [uploaded_file, "transcribe the text inside this document/image."]
    )

    result = {"gemini_output": response.text}

    # Log Gemini output on backend
    print("🔹 Gemini Direct File Response:", result)

    return JSONResponse(content=result)
