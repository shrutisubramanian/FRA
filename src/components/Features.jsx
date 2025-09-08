import React from 'react';
import { Database, Map, Target } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Database,
      title: 'Data Digitization',
      description: 'Convert legacy FRA documents into structured digital data using OCR and NLP.',
      color: 'forest',
      buttonText: 'Learn More',
      action: () => {
        // Placeholder for digitization functionality
        alert('Data Digitization module would be launched here. This will include OCR document processing and data structuring tools.');
      }
    },
    {
      icon: Map,
      title: 'Interactive Map',
      description: 'Visualize FRA claims, land use, and village boundaries on an interactive map.',
      color: 'government',
      buttonText: 'View Mapping',
      action: () => {
        // Placeholder for map functionality
        alert('Interactive Map module would be launched here. This will display satellite imagery, FRA claims, and village boundaries.');
      }
    },
    {
      icon: Target,
      title: 'Scheme Recommendations',
      description: 'Simple Decision Support System suggests appropriate govt schemes for villages.',
      color: 'forest',
      buttonText: 'See DSS Logic',
      action: () => {
        // Placeholder for recommendation functionality
        alert('Scheme Recommendation System would be launched here. This will analyze village data and suggest appropriate government schemes.');
      }
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools designed to streamline Forest Rights Act implementation 
            and support tribal welfare initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <div
                key={index}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md"
              >
                <div className={`inline-flex p-3 rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300 ${
                  feature.color === 'forest' 
                    ? 'bg-forest-50 text-forest-600' 
                    : 'bg-government-50 text-government-600'
                }`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <button
                  onClick={feature.action}
                  className={`group/btn w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${
                    feature.color === 'forest'
                      ? 'border-forest-200 text-forest-700 hover:bg-forest-50 hover:border-forest-300 hover:text-forest-800'
                      : 'border-government-200 text-government-700 hover:bg-government-50 hover:border-government-300 hover:text-government-800'
                  }`}
                >
                  <span className="group-hover/btn:underline decoration-1 underline-offset-2">
                    {feature.buttonText}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
