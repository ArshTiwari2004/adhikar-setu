import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, MapPin, FileText, CheckCircle, AlertCircle, ChevronDown, Loader, BarChart3, Home, UserCheck, FileWarning, ClipboardList } from 'lucide-react';

import { schemes } from '../data/schemes.js';
import { 
  mockBeneficiaries, 
  villageData, 
  getUniqueVillages, 
  getUniqueStates, 
  getVillagesByState, 
  getBeneficiariesByFilters,
  getBeneficiariesByVillage 
} from '../data/mockdata.js';
import EligibilityEngine from '../utils/EligibilityEngine.js';

import rulesConfig from '../data/rules.json';

// Initialize the eligibility engine
const eligibilityEngine = new EligibilityEngine(rulesConfig);

// Eligibility Rules 
const checkEligibility = (beneficiary, schemeId) => {
  const rules = {
    'pm-kisan': (b) => ({
      eligible: b.fraHolder && b.landSize <= 2.0 && b.landSize > 0 && b.hasAadhaar && b.hasBankAccount,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'landSize', label: 'Land Size (0-2 ha)', value: b.landSize, required: b.landSize <= 2.0 && b.landSize > 0 },
        { field: 'hasAadhaar', label: 'Aadhaar Card', value: b.hasAadhaar, required: true },
        { field: 'hasBankAccount', label: 'Bank Account', value: b.hasBankAccount, required: true }
      ]
    }),
    'mgnrega': (b) => ({
      eligible: b.hasJobCard && (b.category === 'ST' ? b.fraHolder : true),
      requirements: [
        { field: 'hasJobCard', label: 'Job Card', value: b.hasJobCard, required: true },
        { field: 'fraHolder', label: 'FRA Holder (if ST)', value: b.fraHolder, required: b.category === 'ST' }
      ]
    }),
    'pmay-gramin': (b) => ({
      eligible: b.fraHolder && b.housingStatus !== 'Pucca' && b.seccVerified,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'housingStatus', label: 'Non-Pucca House', value: b.housingStatus !== 'Pucca', required: true },
        { field: 'seccVerified', label: 'SECC Verified', value: b.seccVerified, required: true }
      ]
    }),
    'jal-jeevan': (b) => ({
      eligible: (b.villageWaterCoverage < 100) && (b.communityFRAStatus || b.fraHolder),
      requirements: [
        { field: 'villageWaterCoverage', label: 'Water Coverage <100%', value: b.villageWaterCoverage < 100, required: true },
        { field: 'communityFRAStatus', label: 'Community FRA or Individual FRA', value: b.communityFRAStatus || b.fraHolder, required: true }
      ]
    }),
    'dajgua': (b) => ({
      eligible: b.fraHolder && b.category === 'ST' && b.villageSTPopulationPercent >= 50 && b.villageTotalPopulation >= 500,
      requirements: [
        { field: 'fraHolder', label: 'FRA Holder', value: b.fraHolder, required: true },
        { field: 'category', label: 'ST Category', value: b.category === 'ST', required: true },
        { field: 'villageSTPopulationPercent', label: 'ST Population ≥50%', value: b.villageSTPopulationPercent >= 50, required: true },
        { field: 'villageTotalPopulation', label: 'Village Population ≥500', value: b.villageTotalPopulation >= 500, required: true }
      ]
    }),
    'pmjay': (b) => ({
      eligible: (b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory) && (b.fraHolder || ['ST', 'SC'].includes(b.category)),
      requirements: [
        { field: 'incomeOrDeprivation', label: 'BPL or SECC Deprivation', value: b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory, required: true },
        { field: 'fraHolderOrCategory', label: 'FRA Holder or ST/SC Category', value: b.fraHolder || ['ST', 'SC'].includes(b.category), required: true }
      ]
    })
  };
  
  return rules[schemeId] ? rules[schemeId](beneficiary) : { eligible: false, requirements: [] };
};


const getActionSteps = (field, beneficiary, scheme) => {
  const actions = {
    'fraHolder': 'Apply for FRA (Forest Rights Act) title at the local Gram Panchayat office.',
    'hasAadhaar': 'Visit the nearest Aadhaar enrollment center with required documents.',
    'hasBankAccount': 'Open a bank account under the PMJDY scheme with minimal documentation.',
    'hasJobCard': 'Apply for a Job Card at the Gram Panchayat or Block Development Office.',
    'seccVerified': 'Get your family verified in the SECC (Socio-Economic Caste Census) database.',
    'housingStatus': 'Your current housing status does not qualify for this scheme.',
    'villageWaterCoverage': 'This requirement depends on village infrastructure development.',
    'communityFRAStatus': 'Community needs to apply for Community Forest Rights title.',
    'category': 'This scheme is specifically for certain categories only.',
    'villageSTPopulationPercent': 'This requirement depends on village demographic composition.',
    'villageTotalPopulation': 'This requirement depends on village population size.',
    'incomeOrDeprivation': 'Verify your income status or deprivation category with local authorities.',
    'fraHolderOrCategory': 'You need to either be an FRA holder or belong to ST/SC category.'
  };
  
  return actions[field] || `Contact local authorities to fulfill ${field} requirement for ${scheme.name}.`;
};

const DSS = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    state: '',
    village: '',
    beneficiary: ''
  });
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [showEligibility, setShowEligibility] = useState(false);
  const [availableVillages, setAvailableVillages] = useState(getUniqueVillages());
  const [availableBeneficiaries, setAvailableBeneficiaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('schemes');
  const [expandedBeneficiary, setExpandedBeneficiary] = useState(null);

  
  useEffect(() => {
    if (filters.state) {
      const villages = getVillagesByState(filters.state);
      setAvailableVillages(villages);
      
      
      if (filters.village && !villages.includes(filters.village)) {
        setFilters(prev => ({ ...prev, village: '', beneficiary: '' }));
      }
    } else {
      setAvailableVillages(getUniqueVillages());
    }

    // Update beneficiaries based on selected village
    if (filters.village) {
      const beneficiaries = getBeneficiariesByVillage(filters.village);
      setAvailableBeneficiaries(beneficiaries.map(b => b.name));
      
      // Reset beneficiary if it's not available for selected village
      if (filters.beneficiary && !beneficiaries.some(b => b.name === filters.beneficiary)) {
        setFilters(prev => ({ ...prev, beneficiary: '' }));
      }
    } else {
      setAvailableBeneficiaries([]);
    }
  }, [filters.state, filters.village]);

  const handleSearch = () => {
    setIsLoading(true);
    setHasSearched(true);
    
    let beneficiaries = [];
    
    if (filters.beneficiary) {
      beneficiaries = getBeneficiariesByFilters(filters.state, filters.village, filters.beneficiary);
    } else if (filters.village) {
      beneficiaries = getBeneficiariesByFilters(filters.state, filters.village);
    } else if (filters.state) {
      beneficiaries = getBeneficiariesByFilters(filters.state);
    }
    
    setFilteredBeneficiaries(beneficiaries);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
  };

  const SchemeCard = ({ scheme }) => {
    const IconComponent = scheme.icon;
    return (
      <div 
        className="bg-white rounded-lg p-4 border border-gray-200 transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
        onClick={() => navigate(`/scheme/${scheme.id}`)}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`p-3 bg-gradient-to-br ${scheme.color} rounded-lg text-white mr-4`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{scheme.name}</h3>
              <p className="text-xs text-gray-500 truncate">{scheme.ministry}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">{scheme.description}</p>
          <div className="flex items-center text-green-600 font-medium text-xs">
            <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{scheme.benefit}</span>
          </div>
        </div>
      </div>
    );
  };

  const RequirementDetail = ({ requirement, scheme, beneficiary }) => {
    if (requirement.value === true) {
      return (
        <div className="flex items-center text-green-700 mb-1">
          <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{requirement.label}</span>
        </div>
      );
    } else {
      return (
        <div className="mb-2">
          <div className="flex items-start text-red-700 mb-1">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium">{requirement.label}</span>
          </div>
          <div className="ml-6 pl-1 border-l-2 border-red-200">
            <p className="text-xs text-gray-600 mb-1">Action needed:</p>
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {getActionSteps(requirement.field, beneficiary, scheme)}
            </p>
          </div>
        </div>
      );
    }
  };

  const BeneficiaryCard = ({ beneficiary }) => {
    const isExpanded = expandedBeneficiary === beneficiary.id;
    
    return (
      <div className="bg-white rounded-lg p-5 mb-4 border border-gray-100 hover:border-blue-100 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <UserCheck className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-gray-800 truncate">{beneficiary.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">S/o {beneficiary.fatherName}</p>
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span>{beneficiary.village}, {beneficiary.state}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                beneficiary.category === 'ST' ? 'bg-purple-100 text-purple-800' :
                beneficiary.category === 'SC' ? 'bg-blue-100 text-blue-800' :
                beneficiary.category === 'OBC' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {beneficiary.category}
              </span>
              {beneficiary.fraHolder && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  FRA Holder
                </span>
              )}
            </div>
            <div className="flex text-xs text-gray-500 gap-3">
              <span>Land: {beneficiary.landSize} ha</span>
              <span>Housing: {beneficiary.housingStatus}</span>
            </div>
          </div>
        </div>

        {/* Eligibility Summary */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <BarChart3 className="w-4 h-4 mr-1" />
            Scheme Eligibility Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {schemes.map(scheme => {
              const eligibility = checkEligibility(beneficiary, scheme.id);
              return (
                <div 
                  key={scheme.id} 
                  className={`p-2 rounded text-center transition-colors duration-150 cursor-pointer ${
                    eligibility.eligible 
                      ? 'bg-green-50 hover:bg-green-100' 
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                  onClick={() => setExpandedBeneficiary(isExpanded ? null : beneficiary.id)}
                >
                  <div className="flex items-center justify-center mb-1">
                    {eligibility.eligible ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                  <p className={`text-xs font-medium truncate ${
                    eligibility.eligible ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {scheme.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ClipboardList className="w-4 h-4 mr-1" />
              Detailed Eligibility Requirements
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemes.map(scheme => {
                const eligibility = checkEligibility(beneficiary, scheme.id);
                
                return (
                  <div key={scheme.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 rounded-full mr-2 ${eligibility.eligible ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <h5 className="font-medium text-sm">{scheme.name}</h5>
                      <span className="ml-auto text-xs px-2 py-1 rounded-full bg-white">
                        {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {eligibility.requirements.map((req, idx) => (
                        <RequirementDetail 
                          key={idx} 
                          requirement={req} 
                          scheme={scheme} 
                          beneficiary={beneficiary} 
                        />
                      ))}
                    </div>
                    
                    {!eligibility.eligible && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">To become eligible for {scheme.name}:</p>
                        <ul className="text-xs text-gray-700 pl-4 list-disc">
                          {eligibility.requirements
                            .filter(req => !req.value)
                            .map((req, idx) => (
                              <li key={idx}>{getActionSteps(req.field, beneficiary, scheme)}</li>
                            ))
                          }
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Job Card</p>
              <p className={`font-medium ${beneficiary.hasJobCard ? 'text-green-600' : 'text-red-600'}`}>
                {beneficiary.hasJobCard ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">SECC</p>
              <p className={`font-medium ${beneficiary.seccVerified ? 'text-green-600' : 'text-red-600'}`}>
                {beneficiary.seccVerified ? 'Verified' : 'No'}
              </p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Income</p>
              <p className={`font-medium ${beneficiary.householdIncomeStatus === 'BPL' ? 'text-orange-600' : 'text-green-600'}`}>
                {beneficiary.householdIncomeStatus}
              </p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-gray-500 mb-1">Water Coverage</p>
              <p className={`font-medium ${beneficiary.villageWaterCoverage < 50 ? 'text-red-600' : 'text-green-600'}`}>
                {beneficiary.villageWaterCoverage}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CustomSelect = ({ value, onChange, options, placeholder, disabled = false }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-colors duration-200 ${
          disabled ? 'bg-gray-50 cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700 hover:border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Decision Support System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            FRA-CSS Cross-linking Platform for Tribal Development
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-gray-200">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Total Schemes: {schemes.length}</span>
            </div>
          
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`px-4 py-3 font-medium flex items-center text-sm mr-4 border-b-2 transition-colors duration-200 ${
              activeTab === 'schemes' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('schemes')}
          >
            <Home className="w-4 h-4 mr-2" />
            Schemes
          </button>
          <button
            className={`px-4 py-3 font-medium flex items-center text-sm mr-4 border-b-2 transition-colors duration-200 ${
              activeTab === 'analysis' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analysis')}
            disabled={!hasSearched}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analysis
          </button>
        </div>

        {/* Search Section - MOVED ABOVE SCHEMES */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-5">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Search & Filter Beneficiaries</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <CustomSelect
                value={filters.state}
                onChange={(value) => setFilters({...filters, state: value, village: '', beneficiary: ''})}
                options={getUniqueStates()}
                placeholder="Select state"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <CustomSelect
                value={filters.village}
                onChange={(value) => setFilters({...filters, village: value, beneficiary: ''})}
                options={availableVillages}
                placeholder="Select village"
                disabled={!filters.state}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beneficiary Name</label>
              <CustomSelect
                value={filters.beneficiary}
                onChange={(value) => setFilters({...filters, beneficiary: value})}
                options={availableBeneficiaries}
                placeholder="Select beneficiary"
                disabled={!filters.village}
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                disabled={isLoading || !filters.state}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setFilters({ state: '', village: '', beneficiary: '' });
                  setShowEligibility(false);
                  setFilteredBeneficiaries([]);
                  setHasSearched(false);
                  setExpandedBeneficiary(null);
                }}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {(filters.state || filters.village || filters.beneficiary) && hasSearched && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 flex items-center">
                <span className="font-medium mr-1">Active Filters:</span>
                {filters.state && <span className="bg-blue-100 px-2 py-1 rounded mr-2">State: {filters.state}</span>}
                {filters.village && <span className="bg-blue-100 px-2 py-1 rounded mr-2">Village: {filters.village}</span>}
                {filters.beneficiary && <span className="bg-blue-100 px-2 py-1 rounded mr-2">Name: {filters.beneficiary}</span>}
                <span className="ml-auto font-medium">{filteredBeneficiaries.length} of {mockBeneficiaries.length} beneficiaries</span>
              </p>
            </div>
          )}
        </div>

        {/* Schemes Grid - NOW BELOW SEARCH */}
        {activeTab === 'schemes' && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-500" />
              Central Sector Schemes (CSS)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schemes.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          </div>
        )}

        {/* Beneficiaries Section */}
        {hasSearched && activeTab === 'analysis' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
                Beneficiaries Analysis ({filteredBeneficiaries.length})
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm">
                  <span className="text-gray-500 mr-1">FRA Holders:</span>
                  <span className="font-medium text-green-600">{filteredBeneficiaries.filter(b => b.fraHolder).length}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm">
                  <span className="text-gray-500 mr-1">ST Category:</span>
                  <span className="font-medium text-purple-600">{filteredBeneficiaries.filter(b => b.category === 'ST').length}</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Searching for beneficiaries...
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the data
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBeneficiaries.map(beneficiary => (
                  <BeneficiaryCard key={beneficiary.id} beneficiary={beneficiary} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DSS;