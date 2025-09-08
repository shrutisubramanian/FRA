import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/extract-text", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // 👇 Log frontend response
    console.log("🔹 Frontend Received:", data);

    setText(data.gemini_output);
  };

  return (
    <div>
      <h1>OCR + Gemini Demo</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload</button>

      {text && (
        <div>
          <h2>Gemini Output:</h2>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
