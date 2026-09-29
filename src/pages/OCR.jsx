import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const OCR = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [directOCR, setDirectOCR] = useState(null); // New state for raw Gemini output

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setShowPopup(false);
    setShowErrorPopup(false);
    setDirectOCR(null); // reset before new upload

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await fetch("http://localhost:8000/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ OCR Result:", result);

      // Use directOCR output from backend
      setDirectOCR(result.directOCR);

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("❌ OCR Error:", error);
      setShowErrorPopup(true);
      setTimeout(() => setShowErrorPopup(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Success popup */}
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Data has been extracted successfully
        </div>
      )}

      {/* Error popup */}
      {showErrorPopup && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          OCR extraction failed. Please try again.
        </div>
      )}

      {/* Header */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(188, 139, 79, 0.9), rgba(138, 93, 57, 0.9)), url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=600&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FileText className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              OCR Document Processing
            </h1>
            <p className="text-xl text-earth-100">
              AI-powered OCR for extracting text from FRA applications
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12">
            
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Upload Document
              </h2>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-earth-500 bg-earth-50' 
                    : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-white hover:border-earth-400 hover:bg-earth-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  {file ? (
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  )}

                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {file ? file.name : 'Drop your document here'}
                    </p>
                    <p className="text-gray-500">
                      {file ? 'File uploaded successfully' : 'or click to browse files'}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400">
                    Supports: JPG, PNG, PDF files up to 10MB
                  </p>
                </div>
              </div>

              {/* Extracted Data Display (directOCR) */}
              {directOCR && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-white rounded-xl shadow-lg space-y-2"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Extracted Data</h3>

                  {Object.entries(directOCR).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="font-semibold text-gray-800">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-700">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OCR;
