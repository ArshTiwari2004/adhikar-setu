
class EligibilityEngine {
  constructor(rulesConfig) {
    this.rules = rulesConfig?.schemes || {};
    this.priorityMatrix = rulesConfig?.priority_matrix || { factors: {} };
    this.metadata = rulesConfig?.metadata || {};
  }

  /**
   * Check eligibility for a specific scheme using simplified rules
   */
  checkSchemeEligibility(schemeId, beneficiaryData) {
    // Simplified eligibility rules for prototype
    const simpleRules = {
      'pm-kisan': (b) => {
        return b.fraHolder && 
               b.landSize <= 2.0 && 
               b.landSize > 0 && 
               (b.hasAadhaar !== false) && 
               (b.hasBankAccount !== false);
      },
      'mgnrega': (b) => {
        return b.hasJobCard && (b.category === 'ST' ? b.fraHolder : true);
      },
      'pmay-gramin': (b) => {
        return b.fraHolder && 
               b.housingStatus !== 'Pucca' && 
               (b.seccVerified !== false);
      },
      'jal-jeevan': (b) => {
        return (b.villageWaterCoverage < 100) && 
               (b.communityFRAStatus || b.fraHolder);
      },
      'dajgua': (b) => {
        return b.fraHolder && 
               b.category === 'ST' && 
               b.villageSTPopulationPercent >= 50 && 
               b.villageTotalPopulation >= 500;
      },
      'pmjay': (b) => {
        return (b.householdIncomeStatus === 'BPL' || b.seccDeprivationCategory) && 
               (b.fraHolder || ['ST', 'SC'].includes(b.category));
      }
    };

    const rule = simpleRules[schemeId];
    if (!rule) {
      return { eligible: false, reason: 'Scheme not found' };
    }

    const eligible = rule(beneficiaryData);
    const priorityScore = this.calculatePriorityScore(schemeId, beneficiaryData, eligible);

    return {
      eligible,
      scheme: schemeId,
      priority_score: priorityScore,
      benefits: this.getBenefitDetails(schemeId, beneficiaryData),
      reason: eligible ? 'All criteria met' : 'Some criteria not met'
    };
  }

  /**
   * Calculate priority score
   */
  calculatePriorityScore(schemeId, beneficiaryData, eligible) {
    if (!eligible) return 0;

    let baseScore = 50;
    
    // Scheme-specific base scores
    const schemeScores = {
      'dajgua': 95,
      'mgnrega': 90,
      'pm-kisan': 85,
      'pmjay': 85,
      'pmay-gramin': 80,
      'jal-jeevan': 75
    };

    baseScore = schemeScores[schemeId] || 50;

    // Add bonuses
    if (beneficiaryData.fraHolder) baseScore += 10;
    if (beneficiaryData.category === 'ST') baseScore += 5;
    if (beneficiaryData.householdIncomeStatus === 'BPL') baseScore += 8;
    if (beneficiaryData.housingStatus === 'Kutcha') baseScore *= 1.1;

    return Math.min(Math.floor(baseScore), 100);
  }

  /**
   * Get benefit details
   */
  getBenefitDetails(schemeId, beneficiaryData) {
    const benefits = {
      'pm-kisan': '₹6,000/year direct transfer',
      'mgnrega': beneficiaryData.category === 'ST' && beneficiaryData.fraHolder ? 
                '150 days guaranteed employment' : '100 days guaranteed employment',
      'pmay-gramin': '₹1.2-2.3 lakh housing assistance',
      'jal-jeevan': 'Functional tap water connection (55 LPCD)',
      'dajgua': 'Comprehensive village development (₹50 lakh+)',
      'pmjay': '₹5 lakh health insurance per family/year'
    };

    return benefits[schemeId] || 'Benefits available';
  }

  /**
   * Check eligibility across all schemes
   */
  checkAllSchemes(beneficiaryData) {
    const schemes = ['pm-kisan', 'mgnrega', 'pmay-gramin', 'jal-jeevan', 'dajgua', 'pmjay'];
    const results = {};
    const eligibleSchemes = [];
    const ineligibleSchemes = [];

    schemes.forEach(schemeId => {
      const result = this.checkSchemeEligibility(schemeId, beneficiaryData);
      results[schemeId] = result;

      if (result.eligible) {
        eligibleSchemes.push({
          id: schemeId,
          ...result
        });
      } else {
        ineligibleSchemes.push({
          id: schemeId,
          ...result
        });
      }
    });

    // Sort by priority score
    eligibleSchemes.sort((a, b) => b.priority_score - a.priority_score);

    return {
      beneficiary: beneficiaryData,
      total_schemes: schemes.length,
      eligible_schemes: eligibleSchemes,
      ineligible_schemes: ineligibleSchemes,
      eligibility_rate: (eligibleSchemes.length / schemes.length * 100).toFixed(1),
      detailed_results: results
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(beneficiaryData) {
    const allResults = this.checkAllSchemes(beneficiaryData);
    const recommendations = [];

    allResults.eligible_schemes.forEach(scheme => {
      let priority = 'Medium';
      let urgency = 'Standard';

      // High priority schemes
      if (['dajgua', 'mgnrega', 'pmjay'].includes(scheme.id)) {
        priority = 'High';
      }

      // Urgent cases
      if (scheme.id === 'pmay-gramin' && beneficiaryData.housingStatus === 'Kutcha') {
        urgency = 'Urgent';
      }
      if (scheme.id === 'jal-jeevan' && beneficiaryData.villageWaterCoverage < 30) {
        urgency = 'Urgent';
      }

      recommendations.push({
        scheme_id: scheme.id,
        scheme_name: scheme.id.toUpperCase(),
        priority,
        urgency,
        priority_score: scheme.priority_score,
        action: `Apply for ${scheme.id.toUpperCase()}`,
        benefits: scheme.benefits
      });
    });

    return {
      beneficiary_id: beneficiaryData.id,
      beneficiary_name: beneficiaryData.name,
      total_recommendations: recommendations.length,
      recommendations: recommendations
    };
  }
}

// Default export
export default EligibilityEngine;

// Test function for validation
export const testEngine = () => {
  const mockRules = { schemes: {}, priority_matrix: { factors: {} } };
  const engine = new EligibilityEngine(mockRules);
  
  const testBeneficiary = {
    id: 1,
    name: 'Test User',
    fraHolder: true,
    landSize: 1.5,
    category: 'ST',
    hasJobCard: true,
    housingStatus: 'Kutcha',
    householdIncomeStatus: 'BPL',
    villageWaterCoverage: 45,
    communityFRAStatus: true,
    villageSTPopulationPercent: 75,
    villageTotalPopulation: 1200
  };

  return engine.checkAllSchemes(testBeneficiary);
};