import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Map, Brain, ArrowRight, Users, Leaf, Droplets, Shield, Target, Globe } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: FileText,
      title: 'OCR System',
      description: 'Advanced document scanning and text extraction for FRA applications',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
      path: '/ocr',
      gradient: 'bg-gradient-earth'
    },
    {
      icon: Map,
      title: 'WebGIS Mapping',
      description: 'Interactive mapping system for forest assets and village boundaries',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop',
      path: '/webgis',
      gradient: 'bg-gradient-forest'
    },
    {
      icon: Brain,
      title: 'Decision Support',
      description: 'AI-powered recommendations for government schemes and interventions',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      path: '/dss',
      gradient: 'bg-gradient-sky'
    }
  ];

  const stats = [
    { number: '500+', label: 'Villages Mapped', icon: Users },
    { number: '10K+', label: 'Forest Assets', icon: Leaf },
    { number: '25+', label: 'Water Bodies', icon: Droplets }
  ];

  const aboutFeatures = [
    {
      icon: Shield,
      title: 'Protecting Rights',
      description: 'Ensuring tribal communities receive their rightful forest access and protection'
    },
    {
      icon: Target,
      title: 'Fair Resource Allocation',
      description: 'AI-driven analysis helps distribute government resources equitably and efficiently'
    },
    {
      icon: Globe,
      title: 'Sustainable Development',
      description: 'Promoting environmental conservation while supporting community development'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(53, 149, 53, 0.8), rgba(38, 121, 38, 0.8)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop')`
        }}
      >
        <div className="text-center text-white max-w-4xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            AI-Powered FRA Decision Support System
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-100"
          >
            OCR + WebGIS + DSS for better forest rights monitoring
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/ocr"
              className="inline-flex items-center px-8 py-4 bg-white text-forest-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Explore the System
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-100 text-forest-600 rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Forest Rights Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated platform combines cutting-edge AI technology with traditional knowledge 
              to support sustainable forest management and tribal rights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${feature.gradient} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Link 
                    to={feature.path}
                    className="inline-flex items-center text-forest-600 font-medium hover:text-forest-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        className="py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f0f9f0 0%, #e0f2fe 50%, #faf7f2 100%)'
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-forest-400 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-sky-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-earth-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About the Project</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Bridging technology and tradition for empowered forest communities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=500&fit=crop" 
                  alt="Tribal community and forest conservation"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent"></div>
                
                {/* Floating stats */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-forest-600">50+</div>
                        <div className="text-xs text-gray-600">Districts</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-sky-600">25K+</div>
                        <div className="text-xs text-gray-600">Families</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-earth-600">99%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed">
                  This project empowers tribal communities by combining AI, GIS mapping, and decision 
                  support tools. It simplifies monitoring of forest rights, helps allocate resources 
                  fairly, and promotes sustainable development.
                </p>
                <p className="text-gray-600">
                  By leveraging cutting-edge technology while respecting traditional knowledge, 
                  we create a bridge between modern governance and indigenous wisdom for better 
                  forest management outcomes.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                {aboutFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-lg"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-forest-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4">
                <Link 
                  to="/ocr"
                  className="inline-flex items-center px-6 py-3 bg-forest-600 text-white font-semibold rounded-lg shadow-lg hover:bg-forest-700 transition-all duration-300 transform hover:scale-105"
                >
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.9), rgba(14, 165, 233, 0.9)), url('https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&h=800&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Forest Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join us in building a sustainable future for forest communities through technology.
            </p>
            <Link 
              to="/ocr"
              className="inline-flex items-center px-8 py-4 bg-white text-sky-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
