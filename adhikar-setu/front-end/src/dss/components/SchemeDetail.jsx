// src/dss/components/SchemeDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  FileText, 
  ExternalLink, 
  Calendar, 
  Users, 
  Target, 
  ArrowLeft,
  Shield,
  Clock
} from 'lucide-react';
import { schemes } from '../data/schemes.js';
import BackButton from '../../global/BackButton';

const SchemeDetail = () => {
  const { schemeId } = useParams();
  const scheme = schemes.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Scheme not found</h1>
          <Link 
            to="/dss" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
      <div className="bg-white border-b border-gray-200 py-8 mb-6 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Scheme Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className={`p-4 ${scheme.color || 'bg-gradient-to-br from-blue-500 to-blue-600'} rounded-xl text-black shadow-md mr-6 mb-4 md:mb-0`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {scheme.name}
                  </h1>
                  <p className="text-lg text-gray-600 font-medium mb-4">
                    {scheme.fullName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                  <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                    <Shield className="w-4 h-4 mr-2" />
                    {scheme.ministry}
                  </div>
                  {scheme.deadline && (
                    <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200">
                      <Clock className="w-4 h-4 mr-2" />
                      Active
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 ">
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-6 bg-green-500 rounded-full mr-3"></div>
            <h2 className="text-lg font-semibold text-gray-800">Scheme Overview</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-[15px]">
            {scheme.description}
          </p>
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-all duration-200  group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-50 rounded-lg mr-3 group-hover:bg-green-100 transition-colors">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Primary Benefit</h3>
            </div>
            <p className="text-gray-700 text-sm">{scheme.benefit}</p>
          </div>

          {scheme.deadline && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 transition-all duration-200  group">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Application Deadline</h3>
              </div>
              <p className="text-gray-700 text-sm font-medium">{scheme.deadline}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-green-300 transition-all duration-200  group">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-50 rounded-lg mr-3 group-hover:bg-green-100 transition-colors">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Target Beneficiaries</h3>
            </div>
            <p className="text-gray-700 text-sm">{scheme.target || 'FRA holders and eligible tribal communities'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Eligibility Criteria */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              Eligibility Criteria
            </h2>
            <ul className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 ">
              {scheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700 text-sm leading-relaxed">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              Required Documents
            </h2>
            <ul className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 ">
              {scheme.documents.map((doc, index) => (
                <li key={index} className="flex items-start group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-3 h-3 text-blue-600" />
                    </div>
                  </div>
                  <span className="ml-3 text-gray-700 text-sm leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Application Process */}
        {scheme.process && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              Application Process
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <ol className="space-y-4">
                {scheme.process.map((step, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm mr-4 mt-0.5 group-hover:bg-green-700 transition-colors shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 border-l-2 border-green-100 pl-4 group-hover:border-green-200 transition-colors">
                      <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="bg-green-50 rounded-xl border border-green-100 p-6 text-center shadow-sm">
          <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ExternalLink className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Ready to Apply?
          </h2>
          <p className="text-gray-700 mb-4 max-w-2xl mx-auto text-sm">
            Visit the official scheme website for detailed guidelines, application forms, and the latest updates.
          </p>
          {scheme.link && (
            <a
              href={scheme.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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