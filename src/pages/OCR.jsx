import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

const OCR = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    
    // Simulate OCR processing
    setTimeout(() => {
      setExtractedText(`FOREST RIGHTS ACT APPLICATION

Applicant Name: Ramesh Kumar
Village: Devgaon
District: Gadchiroli
State: Maharashtra

Application Type: Individual Forest Rights Claim

Details of Forest Land:
- Survey Number: 45/2
- Area: 2.5 hectares
- Type of Land: Agricultural
- Location: Near Wainganga River

Traditional Use:
- Cultivation since 1985
- Growing jowar, cotton, and vegetables
- Family dependency: 6 members

Supporting Documents:
✓ Village Assembly Resolution
✓ Gram Sabha Certificate
✓ Revenue Records
✓ Witness Statements

Date of Application: 15th March 2024
Signature: Ramesh Kumar`);
      setIsProcessing(false);
    }, 3000);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
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
              Advanced text extraction from FRA application documents using AI-powered OCR technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h2>
              
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

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-earth-600" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {isProcessing ? (
                      <div className="flex items-center space-x-2 text-earth-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-earth-600"></div>
                        <span className="text-sm">Processing...</span>
                      </div>
                    ) : (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Extracted Text</h2>
              
              <div className="bg-white rounded-xl shadow-lg p-6 h-96 overflow-y-auto">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Processing document...</p>
                    </div>
                  </div>
                ) : extractedText ? (
                  <div>
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                      {extractedText}
                    </pre>
                    <div className="mt-6 flex space-x-4">
                      <button className="flex items-center px-4 py-2 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Download Text
                      </button>
                      <button className="flex items-center px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors">
                        <FileText className="h-4 w-4 mr-2" />
                        Process Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                      <p>Upload a document to see extracted text here</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <FileText className="h-12 w-12 text-earth-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Multi-format Support</h3>
              <p className="text-gray-600">Process PDFs, images, and scanned documents</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <CheckCircle className="h-12 w-12 text-forest-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">High Accuracy</h3>
              <p className="text-gray-600">99%+ accuracy in text extraction</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <Upload className="h-12 w-12 text-sky-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Batch Processing</h3>
              <p className="text-gray-600">Process multiple documents simultaneously</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OCR;
