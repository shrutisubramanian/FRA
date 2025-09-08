import React from 'react';
import { Mail, Phone, MapPin, FileText, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-forest-400 mb-4">
              FRA Atlas & Decision Support System
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering tribal communities through technology-driven Forest Rights Act 
              implementation and comprehensive welfare scheme integration.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-forest-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-government-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-forest-400 mr-3" />
                <span className="text-gray-300">contact@fraatlas.gov.in</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-forest-400 mr-3" />
                <span className="text-gray-300">+91 11-xxxx-xxxx</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-forest-400 mr-3" />
                <span className="text-gray-300">New Delhi, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center text-gray-300 hover:text-forest-400 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3" />
                Project Documentation
              </a>
              <a
                href="#"
                className="flex items-center text-gray-300 hover:text-forest-400 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3" />
                API Documentation
              </a>
              <a
                href="#"
                className="flex items-center text-gray-300 hover:text-forest-400 transition-colors"
              >
                <FileText className="h-5 w-5 mr-3" />
                User Guide
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Ministry of Tribal Affairs, Government of India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
