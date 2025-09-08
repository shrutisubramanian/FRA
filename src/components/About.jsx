import React from 'react';
import { Users, Building, Heart } from 'lucide-react';

const About = () => {
  const targetUsers = [
    {
      icon: Building,
      title: 'Ministry of Tribal Affairs',
      description: 'Central government oversight and policy implementation'
    },
    {
      icon: Users,
      title: 'Tribal Welfare Departments',
      description: 'State-level administration and claim processing'
    },
    {
      icon: Heart,
      title: 'NGOs & Civil Society',
      description: 'Community advocacy and support organizations'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-forest-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About the Project
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              The FRA Atlas & Decision Support System is a comprehensive digital platform designed to 
              revolutionize the implementation and monitoring of the Forest Rights Act (FRA) in India. 
              Our mission is to bridge the gap between traditional documentation and modern technology.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              By leveraging AI-powered document processing, interactive mapping technologies, and intelligent 
              recommendation systems, we aim to make FRA implementation more transparent, efficient, and 
              accessible to tribal communities across the nation.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Project Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-forest-700 mb-2">Digitization & Accessibility</h4>
              <p className="text-gray-600">Transform paper-based FRA records into searchable digital formats accessible to all stakeholders.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-government-700 mb-2">Transparent Monitoring</h4>
              <p className="text-gray-600">Provide real-time tracking and visualization of FRA claim status and implementation progress.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-forest-700 mb-2">Evidence-Based Decisions</h4>
              <p className="text-gray-600">Enable data-driven policy making through comprehensive analytics and reporting tools.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="font-semibold text-government-700 mb-2">Welfare Integration</h4>
              <p className="text-gray-600">Connect tribal communities with appropriate government schemes and development programs.</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Target Users
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {targetUsers.map((user, index) => {
              const IconComponent = user.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-white shadow-lg mb-4">
                    <IconComponent className="h-8 w-8 text-forest-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.title}
                  </h4>
                  <p className="text-gray-600">
                    {user.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
