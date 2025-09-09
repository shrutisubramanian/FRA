from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
import mimetypes

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

YOUR_API_KEY = "AIzaSyDQ9LCPxLMEJfb3rCvWUB9YAIkxxyOoYc4"
# Configure Gemini
genai.configure(api_key=YOUR_API_KEY)  
model = genai.GenerativeModel("gemini-1.5-flash")

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Detect mime type
    mime_type, _ = mimetypes.guess_type(file_location)
    if not mime_type:
        mime_type = "application/octet-stream"  # fallback

    # Upload file with mime_type
    uploaded_file = genai.upload_file(path=file_location, mime_type=mime_type)

    # Ask Gemini to extract/summarize
    response = model.generate_content(
        [uploaded_file, "Extract the text from this document or image."]
    )

    result = {"gemini_output": response.text}
    print("🔹 Gemini Response:", result)
    return JSONResponse(content=result)
