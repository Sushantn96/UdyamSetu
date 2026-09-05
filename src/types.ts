export type Language =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'ta' // Tamil (தமிழ் - Southern)
  | 'te' // Telugu (తెలుగు - Southern)
  | 'kn' // Kannada (ಕನ್ನಡ - Southern)
  | 'ml' // Malayalam (മലയാളം - Southern)
  | 'mr' // Marathi (मराठी)
  | 'bn' // Bengali (বাংলা)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or'; // Odia (ଓଡ଼ିଆ)

export type SchemeType = 'MICRO_FINANCE' | 'TERM_LOAN';

export interface LocationGeo {
  state: string;
  district: string;
  block: string;
  panchayat: string;
  lat?: number;
  lng?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  aadhaarMasked: string;
  category: 'SC' | 'OBC' | 'DNT' | 'EBC' | 'General' | 'SafaiKaramchari';
  location: LocationGeo;
  marginCapital: number;
  businessCategory: string;
  customIdeaDescription?: string;
  annualFamilyIncome?: number;
  gender?: 'Male' | 'Female' | 'Transgender' | 'Other';
  createdAt: string;
}

export interface LocalMarketContext {
  state: string;
  district: string;
  block: string;
  panchayat: string;
  category: string;
  blockPopulation: number;
  panchayatPopulation: number;
  avgMonthlyHouseholdIncome: number;
  nearestMandiName: string;
  distanceToMandiKm: number;
  keyRawMaterials: string[];
  powerSupplyDailyAvgHours: number;
  bankBranchWithin5Km: boolean;
  existingCompetitorCount: number;
  marketDemandRating: 'High' | 'Moderate' | 'Seasonal' | 'Emerging';
  agmarknetPriceBenchmark?: string;
  dataSourceFootnotes: string[];
  lastRefreshed: string;
}

export interface SwotItem {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ThreatItem {
  id: string;
  riskName: string;
  severity: 'Low' | 'Medium' | 'High';
  category: 'Supply Chain' | 'Seasonality' | 'Single-Buyer Dependency' | 'Regulatory' | 'Financial';
  mitigationStrategy: string;
}

export interface CompetitorCluster {
  name: string;
  distanceKm: number;
  scale: 'Micro' | 'Small' | 'Informal';
  estimatedMarketShare: string;
  keyAdvantage: string;
}

export interface UnitEconomics {
  itemOrService: string;
  suggestedSellingPrice: string;
  estimatedCostOfProduction: string;
  grossMarginPercent: number;
  estimatedMonthlyUnits: number;
  projectedMonthlyGrossProfit: number;
}

export interface FeasibilityReport {
  id: string;
  userId: string;
  generatedAt: string;
  feasibilityScore: number; // 0 - 100
  verdict: 'High Feasibility' | 'Moderate Feasibility' | 'Conditional Feasibility';
  verdictExplanation: string;
  scoreBreakdown: {
    localDemand: number;      // 0 - 25
    competitionDensity: number; // 0 - 20
    capitalAdequacy: number;  // 0 - 25
    seasonalRisk: number;     // 0 - 15
    locationFit: number;      // 0 - 15
  };
  marketReach: {
    consumerBase5Km: number;
    consumerBase10Km: number;
    targetDemographics: string;
    primaryDistributionChannels: string[];
  };
  opportunityAnalysis: {
    title: string;
    description: string;
    potentialImpact: 'High' | 'Medium';
  }[];
  swot: SwotItem;
  threats: ThreatItem[];
  competitorMapping: {
    totalEstimatedCompetitors: number;
    densityPerThousandPopulation: number;
    clusters: CompetitorCluster[];
  };
  pricingAndEconomics: {
    summary: string;
    table: UnitEconomics[];
    estimatedMonthlyRevenue: number;
    paybackPeriodMonths: number;
  };
  citations: string[];
  isAiGenerated: boolean;
  executiveSummary?: string;
}

export interface SchemeDetails {
  schemeId: SchemeType;
  schemeName: string;
  schemeNameHindi: string;
  description?: string;
  ministryName: string;
  implementingAgency: string; // e.g. NBCFDC / NSFDC / NSKFDC
  interestRateAnnual: number;
  tenureYears: number;
  moratoriumMonths: number;
  minProjectCost: number;
  maxProjectCost: number;
  maxLoanAmount: number;
  promoterMarginPercent: number; // usually 10%
  subsidyPercentOrAmount: string;
  repaymentCadence: 'Quarterly' | 'Monthly';
}

export interface AmortizationRow {
  period: number; // e.g. Quarter 1, 2, ...
  periodLabel: string;
  openingBalance: number;
  interestPaid: number;
  principalPaid: number;
  totalInstallment: number;
  closingBalance: number;
  isMoratorium: boolean;
}

export interface FinancialCalculationResult {
  marginCapital: number;
  totalProjectCost: number;
  maxLoanEligibility: number;
  scheme: SchemeDetails;
  quarterlyInstallment: number;
  monthlyEquivalentEmi: number;
  totalInterestPayable: number;
  totalRepaymentAmount: number;
  effectiveAnnualCost: number;
  amortizationSchedule: AmortizationRow[];
}

export interface OperatingCostItem {
  id: string;
  category: string;
  description: string;
  monthlyAmount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
  suggestedAction?: {
    type: 'CALCULATE' | 'VIEW_REPORT' | 'DOWNLOAD_REPORT' | 'CONTACT_SUPPORT';
    params?: Record<string, any>;
  };
}
