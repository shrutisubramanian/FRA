import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Droplets, Zap, X, ExternalLink } from 'lucide-react';
import { faker } from '@faker-js/faker';

const DSS = () => {
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    // Generate mock village data
    const mockVillages = Array.from({ length: 9 }, (_, index) => ({
      id: index + 1,
      name: faker.location.city(),
      population: Math.floor(Math.random() * 1000) + 500,
      needs: Math.floor(Math.random() * 5) + 1,
      lastUpdated: faker.date.recent(),
      image: `https://images.unsplash.com/photo-${
        [
          '1516026672322-bc52d61a55d5', // Tribal community
          '1559827260-dc66d52bef19',   // Rural village
          '1618477388406-11593dccc5ee', // Traditional huts
          '1590736969955-d195830cda20', // Village scene
          '1578662996442-48f6c2b9b1b6', // Rural life
          '1571043733612-1dde42cbe2ae'  // Community gathering
        ][index % 6]
      }?w=400&h=300&fit=crop`,
      challenges: [
        'Water scarcity',
        'Limited electricity access',
        'Poor road connectivity',
        'Healthcare access',
        'Education facilities'
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    }));
    setVillages(mockVillages);
  }, []);

  const schemes = [
    {
      id: 1,
      name: 'Jal Jeevan Mission',
      description: 'Providing functional household tap connections to every rural household',
      image: 'https://images.unsplash.com/photo-1582408921715-18e7806365c1?w=600&h=400&fit=crop',
      eligibility: ['Villages with water scarcity', 'Population < 5000', 'No existing water supply'],
      benefits: ['Clean drinking water', 'Improved health outcomes', 'Time savings for women']
    },
    {
      id: 2,
      name: 'Pradhan Mantri Gram Sadak Yojana',
      description: 'Connecting rural areas with quality all-weather roads',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
      eligibility: ['Unconnected villages', 'Population > 250', 'Strategic importance'],
      benefits: ['Better connectivity', 'Economic opportunities', 'Access to services']
    },
    {
      id: 3,
      name: 'Deen Dayal Upadhyaya Grameen Kaushalya Yojana',
      description: 'Skill development program for rural youth',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
      eligibility: ['Rural youth 15-35 years', 'Below poverty line families', 'School dropouts'],
      benefits: ['Employment opportunities', 'Skill certification', 'Higher income potential']
    },
    {
      id: 4,
      name: 'PM-KISAN',
      description: 'Income support scheme for farmer families',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
      eligibility: ['Small and marginal farmers', 'Landholding < 2 hectares', 'Agricultural families'],
      benefits: ['Direct income support', 'Financial security', 'Agricultural investment']
    }
  ];

  const handleVillageClick = (village) => {
    setSelectedVillage(village);
    
    // Simulate AI recommendation based on village needs
    const recommendedScheme = schemes[Math.floor(Math.random() * schemes.length)];
    
    setRecommendation({
      scheme: recommendedScheme,
      confidence: (Math.random() * 20 + 80).toFixed(1), // 80-100% confidence
      reasoning: [
        `${village.name} has ${village.population} residents with identified development needs`,
        `Based on demographic analysis and resource assessment`,
        `${recommendedScheme.name} aligns with the village's priority requirements`,
        `Implementation timeline: 6-12 months with proper coordination`
      ],
      impact: [
        `Expected to benefit ${Math.floor(village.population * 0.8)} residents directly`,
        `Estimated socio-economic improvement: ${(Math.random() * 30 + 40).toFixed(0)}%`,
        `Alignment with SDG goals: High priority match`,
        `Resource allocation required: ₹${(Math.random() * 50 + 25).toFixed(1)} lakhs`
      ]
    });
    
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section 
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.9), rgba(3, 105, 161, 0.9)), url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=600&fit=crop')`
        }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Brain className="h-16 w-16 text-white mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Decision Support System
            </h1>
            <p className="text-xl text-sky-100">
              AI-powered recommendations for government schemes and rural development interventions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Villages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Select a Village for AI Analysis</h2>
            <p className="text-lg text-gray-600">
              Click on any village to get personalized scheme recommendations based on AI analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {villages.map((village, index) => (
              <motion.div
                key={village.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleVillageClick(village)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={village.image} 
                    alt={village.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{village.name}</h3>
                    <p className="text-sm opacity-90">{village.population} residents</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-sky-600" />
                      <span className="text-sm text-gray-600">Population: {village.population}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-gray-600">{village.needs} priority needs</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Challenges:</h4>
                    <div className="flex flex-wrap gap-2">
                      {village.challenges.slice(0, 2).map((challenge, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {challenge}
                        </span>
                      ))}
                      {village.challenges.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{village.challenges.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors font-medium">
                    Get AI Recommendation
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Modal */}
      {showModal && recommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Recommendation</h2>
                <p className="text-gray-600">For {selectedVillage?.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Confidence Score */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">AI Confidence Score</span>
                  <span className="text-lg font-bold text-green-600">{recommendation.confidence}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${recommendation.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommended Scheme */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Scheme</h3>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="relative h-64">
                    <img 
                      src={recommendation.scheme.image} 
                      alt={recommendation.scheme.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="text-2xl font-bold mb-2">{recommendation.scheme.name}</h4>
                      <p className="text-gray-200">{recommendation.scheme.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Eligibility Criteria</h5>
                        <ul className="space-y-2">
                          {recommendation.scheme.eligibility.map((criteria, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Expected Benefits</h5>
                        <ul className="space-y-2">
                          {recommendation.scheme.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Reasoning & Analysis</h3>
                  <div className="space-y-3">
                    {recommendation.reasoning.map((reason, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Expected Impact</h3>
                  <div className="space-y-3">
                    {recommendation.impact.map((impact, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <Zap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors font-medium">
                  Initiate Application Process
                </button>
                <button className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Scheme Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DSS;
