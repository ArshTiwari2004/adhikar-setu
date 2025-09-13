import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, MapPin, FileText, CheckCircle, AlertCircle, ChevronDown, Loader } from 'lucide-react';

// Import all data and utilities
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

// Import rules configuration
import rulesConfig from '../data/rules.json';

// Initialize the eligibility engine
const eligibilityEngine = new EligibilityEngine(rulesConfig);

// Eligibility Rules Engine (simplified for demonstration)
const checkEligibility = (beneficiary, schemeId) => {
  const rules = {
    'pm-kisan': (b) => b.fraHolder && b.landSize <= 2.0 && b.landSize > 0 && b.hasAadhaar && b.hasBankAccount,
    'mgnrega': (b) => b.hasJobCard && (b.category === 'ST' ? b.fraHolder : true),
    'pmay-gramin': (b) => b.fraHolder && b.housingStatus !== 'Pucca' && b.seccVerified,
    'jal-jeevan': (b) => (b.villageWaterCoverage < 100) && (b.communityFRAStatus || b.fraHolder),
    'dajgua': (b) => b.fraHolder && b.category === 'ST' && b.villageSTPopulationPercent >= 50 && b.villageTotalPopulation >= 500,
    'pmjay': (b) => (b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory) && (b.fraHolder || ['ST', 'SC'].includes(b.category))
  };
  
  return rules[schemeId] ? rules[schemeId](beneficiary) : false;
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

  // Update cascading dropdowns
  useEffect(() => {
    // Update villages based on selected state
    if (filters.state) {
      const villages = getVillagesByState(filters.state);
      setAvailableVillages(villages);
      
      // Reset village if it's not available for selected state
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
    
    // Get beneficiaries based on selected filters
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
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
        onClick={() => navigate(`/scheme/${scheme.id}`)}
      >
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`p-3 bg-gradient-to-br ${scheme.color} rounded-lg text-white mr-4`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{scheme.name}</h3>
              <p className="text-sm text-gray-600">{scheme.ministry}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3 text-sm">{scheme.description}</p>
          <div className="flex items-center text-green-600 font-semibold text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            {scheme.benefit}
          </div>
        </div>
      </div>
    );
  };

  const BeneficiaryCard = ({ beneficiary }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{beneficiary.name}</h3>
          <p className="text-sm text-gray-600">S/o {beneficiary.fatherName}</p>
          <p className="text-sm text-gray-500">{beneficiary.village}, {beneficiary.state}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
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
          <p className="text-xs text-gray-500">Land: {beneficiary.landSize} ha</p>
          <p className="text-xs text-gray-500">Housing: {beneficiary.housingStatus}</p>
        </div>
      </div>

      {/* Eligibility Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {schemes.map(scheme => {
          const eligible = checkEligibility(beneficiary, scheme.id);
          return (
            <div 
              key={scheme.id} 
              className={`p-2 rounded border text-center ${
                eligible 
                  ? 'border-green-300 bg-green-50' 
                  : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {eligible ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-3 h-3 text-red-600" />
                )}
              </div>
              <p className={`text-xs font-medium ${
                eligible ? 'text-green-800' : 'text-red-800'
              }`}>
                {scheme.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <p className="text-gray-500">Job Card</p>
            <p className={`font-medium ${beneficiary.hasJobCard ? 'text-green-600' : 'text-red-600'}`}>
              {beneficiary.hasJobCard ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">SECC</p>
            <p className={`font-medium ${beneficiary.seccVerified ? 'text-green-600' : 'text-red-600'}`}>
              {beneficiary.seccVerified ? 'Verified' : 'No'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Income</p>
            <p className={`font-medium ${beneficiary.householdIncomeStatus === 'BPL' ? 'text-orange-600' : 'text-green-600'}`}>
              {beneficiary.householdIncomeStatus}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Water Coverage</p>
            <p className={`font-medium ${beneficiary.villageWaterCoverage < 50 ? 'text-red-600' : 'text-green-600'}`}>
              {beneficiary.villageWaterCoverage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CustomSelect = ({ value, onChange, options, placeholder, disabled = false }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Decision Support System
          </h1>
          <p className="text-xl text-gray-600">
            FRA-CSS Cross-linking Platform for Tribal Development
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Total Schemes: {schemes.length}</span>
            </div>
          </div>
        </div>
        
        {/* Schemes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Central Sector Schemes (CSS)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Search & Filter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                disabled={isLoading || !filters.village}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Show Results'
                )}
              </button>
              <button
                onClick={() => {
                  setFilters({ state: '', village: '', beneficiary: '' });
                  setShowEligibility(false);
                  setFilteredBeneficiaries([]);
                  setHasSearched(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {(filters.state || filters.village || filters.beneficiary) && hasSearched && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Active Filters:</strong>
                {filters.state && ` State: ${filters.state}`}
                {filters.village && ` | Village: ${filters.village}`}
                {filters.beneficiary && ` | Name: ${filters.beneficiary}`}
                {` | Showing ${filteredBeneficiaries.length} of ${mockBeneficiaries.length} beneficiaries`}
              </p>
            </div>
          )}
        </div>

        {/* Beneficiaries Section */}
        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Beneficiaries Analysis ({filteredBeneficiaries.length})
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  FRA Holders: {filteredBeneficiaries.filter(b => b.fraHolder).length}
                </div>
                <div className="text-sm text-gray-600">
                  ST Category: {filteredBeneficiaries.filter(b => b.category === 'ST').length}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Searching for beneficiaries...
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the data
                </p>
              </div>
            ) : showEligibility ? (
              <div className="space-y-4">
                {filteredBeneficiaries.map(beneficiary => (
                  <BeneficiaryCard key={beneficiary.id} beneficiary={beneficiary} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {filteredBeneficiaries.length} Beneficiaries Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Show Details" to view detailed eligibility assessment for each beneficiary
                </p>
                <button
                  onClick={() => setShowEligibility(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold"
                >
                  Show Eligibility Details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DSS;