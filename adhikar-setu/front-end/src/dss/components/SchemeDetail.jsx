// src/dss/components/SchemeDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import { schemes } from '../data/schemes.js';

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const scheme = schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Scheme not found</h1>
            <Link to="/dss" className="text-blue-600 hover:text-blue-800">
              Return to DSS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = scheme.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/dss"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to DSS
        </Link>

        {/* Scheme Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center">
            <div className={`p-4 bg-gradient-to-br ${scheme.color} rounded-lg text-white mr-6`}>
              <IconComponent className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{scheme.name}</h1>
              <p className="text-xl text-gray-600">{scheme.fullName}</p>
              <p className="text-gray-500">{scheme.ministry}</p>
            </div>
          </div>
        </div>

        {/* Scheme Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-700">{scheme.description}</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Benefit</h2>
            <div className="flex items-center text-green-600 font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              {scheme.benefit}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Eligibility Criteria</h2>
            <ul className="space-y-2">
              {scheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Required Documents</h2>
            <ul className="space-y-2">
              {scheme.documents.map((doc, index) => (
                <li key={index} className="flex items-start">
                  <FileText className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          

         
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;