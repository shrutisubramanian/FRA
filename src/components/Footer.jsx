import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'OCR System', path: '/ocr' },
    { name: 'WebGIS', path: '/webgis' },
    { name: 'DSS', path: '/dss' },
  ];

  return (
    <footer 
      className="relative bg-gray-900 text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(53, 149, 53, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200"><path d="M0,100 C300,150 900,50 1200,100 L1200,200 L0,200 Z" fill="rgba(53,149,53,0.1)"/></svg>')`
      }}
    >
      {/* Decorative forest silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <svg viewBox="0 0 1200 120" className="w-full h-full">
          <path 
            d="M0,60 C200,40 400,80 600,60 C800,40 1000,80 1200,60 L1200,120 L0,120 Z" 
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Project Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <TreePine className="h-8 w-8 text-forest-400" />
              <div>
                <h3 className="text-2xl font-bold text-white">FRA DSS</h3>
                <p className="text-gray-300 text-sm">AI-Powered Decision Support System</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Empowering tribal communities through cutting-edge AI technology, GIS mapping, 
              and intelligent decision support for sustainable forest rights management.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Forest Rights Act Implementation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>24/7 System Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@fra-dss.gov.in</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-300 hover:text-forest-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Document OCR Processing</li>
              <li>• Interactive GIS Mapping</li>
              <li>• AI Recommendations</li>
              <li>• Asset Management</li>
              <li>• Village Analytics</li>
              <li>• Scheme Matching</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 FRA DSS Project. All rights reserved. Built for sustainable forest management.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/" className="hover:text-forest-400 transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-forest-400 transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-forest-400 transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
