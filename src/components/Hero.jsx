import React from 'react';
import { Satellite, TreePine } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-forest-50 via-white to-government-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 text-forest-200 opacity-50">
            <TreePine className="h-16 w-16" />
          </div>
          <div className="absolute top-32 right-10 text-government-200 opacity-50">
            <Satellite className="h-12 w-12" />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-forest-600">FRA Atlas</span> &{' '}
              <span className="text-government-600">Decision Support System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              An interactive platform to visualize and manage Forest Rights Act claims, 
              integrate satellite mapping, and recommend government schemes for tribal welfare.
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-government-600 text-government-600 hover:bg-government-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
