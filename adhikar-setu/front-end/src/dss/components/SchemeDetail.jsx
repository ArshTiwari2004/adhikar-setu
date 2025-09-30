// src/dss/components/SchemeDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, FileText, ExternalLink, Calendar, Users, Target, Banknote } from 'lucide-react';
import { schemes } from '../data/schemes.js';
import BackButton from '../../global/BackButton';

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const scheme = schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Scheme not found</h1>
          <Link 
            to="/dss" 
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to DSS
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = scheme.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          <BackButton />

          <div className="flex flex-col md:flex-row items-start">
            <div className={`p-5 bg-opacity-20 rounded-2xl mr-6 mb-4 md:mb-0 `}>
              <IconComponent className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {scheme.name}
              </h1>
              <p className="text-xl text-green-100 font-medium mb-4 ">
                {scheme.fullName}
              </p>
              <div className="inline-flex items-center px-4 py-2rounded-lg p-4 border border-gray-200 bg-white bg-opacity-20 text-black text-sm font-medium backdrop-blur-sm">
                {scheme.ministry}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 ">
          <p className="text-gray-700 text-lg leading-relaxed">
            {scheme.description}
          </p>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="font-semibold text-gray-800">Primary Benefit</h3>
            </div>
            <p className="text-gray-700">{scheme.benefit}</p>
          </div>

          {scheme.deadline && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="font-semibold text-gray-800">Application Deadline</h3>
              </div>
              <p className="text-gray-700">{scheme.deadline}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="font-semibold text-gray-800">Target Beneficiaries</h3>
            </div>
            <p className="text-gray-700">{scheme.target || 'FRA holders and eligible tribal communities'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Eligibility Criteria */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Eligibility Criteria
            </h2>
            <ul className="space-y-4 rounded-lg p-4 border border-gray-200">
              {scheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Required Documents
            </h2>
            <ul className="space-y-4 rounded-lg p-4 border border-gray-200">
              {scheme.documents.map((doc, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Application Process */}
        {scheme.process && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Application Process
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ol className="space-y-4">
                {scheme.process.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold mr-4">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Need more information?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Visit the official scheme website for detailed guidelines, application forms, and updates.
          </p>
          {scheme.link && (
            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Visit Official Website
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;