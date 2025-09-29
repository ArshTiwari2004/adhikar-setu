import { Banknote, Users, Home, Droplet, MapPin, Heart } from 'lucide-react';

export const schemes = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    fullName: 'Pradhan Mantri Kisan Samman Nidhi',
    ministry: 'Agriculture & Farmers Welfare',
    benefit: '₹6,000/year direct transfer',
    icon: Banknote,
    description: 'Financial assistance to small and marginal farmers owning cultivable land up to 2 hectares',
    eligibility: [
      'FRA Patta holder with land records',
      'Cultivable land ≤ 2 hectares',
      'Valid Aadhaar linked to bank account',
      'Active bank account with IFSC'
    ],
    documents: [
      'Land Record/FRA Patta showing cultivable land',
      'Aadhaar Card',
      'Bank Account Details (Passbook/Cheque)',
      'Passport size photographs'
    ],
   
    color: 'from-green-500 to-emerald-600',
    link:'https://pmkisan.gov.in/homenew.aspx'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    fullName: 'Mahatma Gandhi National Rural Employment Guarantee Act',
    ministry: 'Rural Development',
    benefit: '100-150 days guaranteed employment',
    icon: Users,
    description: 'Guaranteed wage employment for rural households (150 days for FRA holders from ST category)',
    eligibility: [
      'Job Card holder under MGNREGA',
      'Rural household registration',
      'ST category with FRA Patta for 150 days guarantee',
      'Adult members available for work'
    ],
    documents: [
      'MGNREGA Job Card',
      'FRA Patta (for ST households seeking 150 days)',
      'Aadhaar Card',
      'Bank Account Details',
      'Caste Certificate (if applicable)'
    ],
    
    color: 'from-blue-500 to-cyan-600',
    link :'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx'
  },
  {
    id: 'pmay-gramin',
    name: 'PMAY-Gramin',
    fullName: 'Pradhan Mantri Awas Yojana - Gramin',
    ministry: 'Rural Development',
    benefit: '₹1.2-2.3 lakh housing assistance',
    icon: Home,
    description: 'Housing assistance for rural poor families without pucca houses',
    eligibility: [
      'No pucca house ownership',
      'FRA Patta holder for land rights',
      'SECC verification or Gram Sabha approval',
      'Family income below specified limits'
    ],
    documents: [
      'SECC Data/Gram Sabha verification showing no pucca house',
      'FRA Patta for construction site',
      'Aadhaar Card',
      'Income Certificate',
      'Caste Certificate (if applicable)'
    ],
    
    color: 'from-orange-500 to-red-600',
    link: 'https://pmayg.dord.gov.in/netiayHome/home.aspx'
  },
  {
    id: 'jal-jeevan',
    name: 'Jal Jeevan Mission',
    fullName: 'Jal Jeevan Mission - Har Ghar Jal',
    ministry: 'Jal Shakti',
    benefit: 'Functional tap water connection (55 LPCD)',
    icon: Droplet,
    description: 'Providing functional tap water connection to every rural household',
    eligibility: [
      'Village/household without adequate tap water connection',
      'Community FRA Patta for infrastructure development',
      'Gram Panchayat resolution for water supply project',
      'Contribution for maintenance (if required)'
    ],
    documents: [
      'Village Water Status Report',
      'Community FRA Patta',
      'Gram Panchayat Resolution',
      'Household Survey Data',
      'Water Quality Test Reports'
    ],
   
    color: 'from-cyan-500 to-blue-600',
    link: 'https://jaljeevanmission.gov.in/'
  },
  {
    id: 'dajgua',
    name: 'DAJGUA (PM-JUGA)',
    fullName: 'Development Action Plan for Scheduled Tribes (PM-JUGA)',
    ministry: 'Tribal Affairs',
    benefit: 'Comprehensive village development (₹50 lakh+)',
    icon: MapPin,
    description: 'Holistic development of tribal villages with comprehensive infrastructure and livelihood support',
    eligibility: [
      'Village with ≥50% Scheduled Tribe population',
      'Total population ≥500 in the village',
      'FRA implementation in the village',
      'Identified gaps in basic infrastructure'
    ],
    documents: [
      'Census Data showing ST population percentage',
      'Village FRA Implementation Records',
      'Gram Sabha Resolution',
      'Gap Analysis Report',
      'Village Development Plan'
    ],
    
    color: 'from-purple-500 to-indigo-600',
    link: 'https://tribal.nic.in/dajagua.aspx'
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat PMJAY',
    fullName: 'Pradhan Mantri Jan Arogya Yojana',
    ministry: 'Health & Family Welfare',
    benefit: '₹5 lakh health insurance per family/year',
    icon: Heart,
    description: 'Health insurance coverage for vulnerable families as per SECC database',
    eligibility: [
      'Family listed in SECC database with deprivation criteria',
      'BPL household or vulnerable category',
      'FRA Patta holder families get priority enrollment',
      'No upper limit on family size or age'
    ],
    documents: [
      'SECC Data/PMJAY eligibility verification',
      'Ration Card showing BPL status',
      'FRA Patta (for priority enrollment)',
      'Aadhaar Cards of all family members',
      'Caste Certificate (if applicable)'
    ],
  
    color: 'from-pink-500 to-rose-600',
    link: 'https://nha.gov.in/PM-JAY'
  }
];

export default schemes;