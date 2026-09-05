import { SchemeDetails, FinancialCalculationResult, AmortizationRow, OperatingCostItem } from '../types';

export type { SchemeDetails };

export interface AmortizationSchedule {
  moratoriumQuarters: number;
  installments: {
    quarterNumber: number;
    periodLabel: string;
    openingBalance: number;
    interestPaid: number;
    principalPaid: number;
    installmentAmount: number;
    closingBalance: number;
    isMoratorium: boolean;
  }[];
  summary: {
    totalInterestPaid: number;
    totalRepaid: number;
    averageQuarterlyInstallment: number;
  };
}

export const MICRO_FINANCE_SCHEME: SchemeDetails = {
  schemeId: 'MICRO_FINANCE',
  schemeName: 'MoSJE Micro Finance Scheme (Mahila / Krishi Adhikar)',
  schemeNameHindi: 'सामाजिक न्याय मंत्रालय सूक्ष्म वित्त योजना',
  description: 'Targeted micro-finance designed for rural micro-entrepreneurs with low capital outlay and quarterly repayment flexibility.',
  ministryName: 'Ministry of Social Justice and Empowerment',
  implementingAgency: 'National Backward Classes / Scheduled Castes Finance & Dev. Corp. (NBCFDC/NSFDC)',
  interestRateAnnual: 6.5,
  tenureYears: 3,
  moratoriumMonths: 3,
  minProjectCost: 20000,
  maxProjectCost: 140000,
  maxLoanAmount: 125000,
  promoterMarginPercent: 10,
  subsidyPercentOrAmount: 'Up to ₹20,000 or 15% back-ended capital subsidy',
  repaymentCadence: 'Quarterly'
};

export const TERM_LOAN_SCHEME: SchemeDetails = {
  schemeId: 'TERM_LOAN',
  schemeName: 'MoSJE General Term Loan Scheme',
  schemeNameHindi: 'सामाजिक न्याय मंत्रालय सामान्य मियादी ऋण (टर्म लोन) योजना',
  description: 'Longer-tenure term loan for scale-up enterprises, capital equipment, and medium-scale rural setups.',
  ministryName: 'Ministry of Social Justice and Empowerment',
  implementingAgency: 'State Channelising Agencies (SCAs) & RRBs / Public Sector Banks',
  interestRateAnnual: 8.0,
  tenureYears: 7,
  moratoriumMonths: 6,
  minProjectCost: 140001,
  maxProjectCost: 5000000,
  maxLoanAmount: 4500000,
  promoterMarginPercent: 10,
  subsidyPercentOrAmount: 'Interest subvention of 3% for timely quarterly repayments',
  repaymentCadence: 'Quarterly'
};

export function calculateLoanDetails(marginCapital: number): FinancialCalculationResult {
  const safeMargin = Math.max(1000, marginCapital);
  // Total Project Cost = Margin Capital / 10%
  const computedProjectCost = safeMargin / 0.10;
  
  // Scheme selection logic based on project cost
  const scheme = computedProjectCost <= 140000 ? { ...MICRO_FINANCE_SCHEME } : { ...TERM_LOAN_SCHEME };

  // Project Cost capped if beyond scheme limits
  const totalProjectCost = Math.min(computedProjectCost, scheme.maxProjectCost);

  // Maximum loan eligibility: 90% of project cost, capped at scheme max loan
  const maxLoanEligibility = Math.min(totalProjectCost * 0.90, scheme.maxLoanAmount);

  // Generate quarterly amortization schedule
  const totalQuarters = scheme.tenureYears * 4;
  const moratoriumQuarters = Math.round(scheme.moratoriumMonths / 3);
  const activeQuarters = totalQuarters - moratoriumQuarters;

  // Quarterly interest rate = annual rate / 4 / 100
  const quarterlyRate = (scheme.interestRateAnnual / 4) / 100;

  // Standard reducing-balance quarterly installment for post-moratorium periods:
  // EMI = [P * r * (1+r)^n] / [(1+r)^n - 1]
  const P = maxLoanEligibility;
  const r = quarterlyRate;
  const n = activeQuarters;

  let regularQuarterlyInstallment = 0;
  if (r > 0 && n > 0) {
    const factor = Math.pow(1 + r, n);
    regularQuarterlyInstallment = (P * r * factor) / (factor - 1);
  }

  const schedule: AmortizationRow[] = [];
  let currentBalance = P;
  let totalInterest = 0;
  let totalRepayment = 0;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const interestForQuarter = currentBalance * quarterlyRate;
    
    let principalPaid = 0;
    let installment = 0;

    if (isMoratorium) {
      // In government concessional schemes, during moratorium borrower pays interest-only
      installment = interestForQuarter;
      principalPaid = 0;
    } else {
      installment = Math.min(regularQuarterlyInstallment, currentBalance + interestForQuarter);
      principalPaid = installment - interestForQuarter;
      if (q === totalQuarters || currentBalance - principalPaid < 1) {
        principalPaid = currentBalance;
        installment = principalPaid + interestForQuarter;
      }
    }

    const closingBalance = Math.max(0, currentBalance - principalPaid);
    totalInterest += interestForQuarter;
    totalRepayment += installment;

    schedule.push({
      period: q,
      periodLabel: `Quarter ${q}${isMoratorium ? ' (Moratorium)' : ''}`,
      openingBalance: Math.round(currentBalance),
      interestPaid: Math.round(interestForQuarter),
      principalPaid: Math.round(principalPaid),
      totalInstallment: Math.round(installment),
      closingBalance: Math.round(closingBalance),
      isMoratorium
    });

    currentBalance = closingBalance;
    if (currentBalance <= 0) break;
  }

  const monthlyEquivalentEmi = Math.round(regularQuarterlyInstallment / 3);

  return {
    marginCapital: safeMargin,
    totalProjectCost: Math.round(totalProjectCost),
    maxLoanEligibility: Math.round(maxLoanEligibility),
    scheme,
    quarterlyInstallment: Math.round(regularQuarterlyInstallment),
    monthlyEquivalentEmi,
    totalInterestPayable: Math.round(totalInterest),
    totalRepaymentAmount: Math.round(totalRepayment),
    effectiveAnnualCost: scheme.interestRateAnnual,
    amortizationSchedule: schedule
  };
}

export function calculateFinancialScheme(marginCapital: number) {
  const res = calculateLoanDetails(marginCapital);
  return {
    ...res,
    isMicroFinance: res.scheme.schemeId === 'MICRO_FINANCE',
    promoterMargin: res.marginCapital
  };
}

export function generateAmortizationSchedule(
  loanAmount: number,
  interestRateAnnual: number,
  tenureYears: number,
  moratoriumMonths: number
): AmortizationSchedule {
  const totalQuarters = tenureYears * 4;
  const moratoriumQuarters = Math.round(moratoriumMonths / 3);
  const activeQuarters = totalQuarters - moratoriumQuarters;
  const quarterlyRate = (interestRateAnnual / 4) / 100;

  let regularQuarterlyInstallment = 0;
  if (quarterlyRate > 0 && activeQuarters > 0) {
    const factor = Math.pow(1 + quarterlyRate, activeQuarters);
    regularQuarterlyInstallment = (loanAmount * quarterlyRate * factor) / (factor - 1);
  }

  const installments = [];
  let currentBalance = loanAmount;
  let totalInterest = 0;
  let totalRepayment = 0;

  for (let q = 1; q <= totalQuarters; q++) {
    const isMoratorium = q <= moratoriumQuarters;
    const interestForQuarter = currentBalance * quarterlyRate;
    let principalPaid = 0;
    let installment = 0;

    if (isMoratorium) {
      installment = interestForQuarter;
      principalPaid = 0;
    } else {
      installment = Math.min(regularQuarterlyInstallment, currentBalance + interestForQuarter);
      principalPaid = installment - interestForQuarter;
      if (q === totalQuarters || currentBalance - principalPaid < 1) {
        principalPaid = currentBalance;
        installment = principalPaid + interestForQuarter;
      }
    }

    const closingBalance = Math.max(0, currentBalance - principalPaid);
    totalInterest += interestForQuarter;
    totalRepayment += installment;

    installments.push({
      quarterNumber: q,
      periodLabel: `Quarter ${q}${isMoratorium ? ' (Moratorium)' : ''}`,
      openingBalance: Math.round(currentBalance),
      interestPaid: Math.round(interestForQuarter),
      principalPaid: Math.round(principalPaid),
      installmentAmount: Math.round(installment),
      closingBalance: Math.round(closingBalance),
      isMoratorium
    });

    currentBalance = closingBalance;
    if (currentBalance <= 0) break;
  }

  return {
    moratoriumQuarters,
    installments,
    summary: {
      totalInterestPaid: Math.round(totalInterest),
      totalRepaid: Math.round(totalRepayment),
      averageQuarterlyInstallment: Math.round(regularQuarterlyInstallment)
    }
  };
}

export function formatCurrencyINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumberINR(amount: number): string {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateCsvSchedule(schedule: AmortizationRow[]): string {
  const headers = ['Quarter', 'Period Label', 'Opening Balance (INR)', 'Interest (INR)', 'Principal (INR)', 'Installment (INR)', 'Closing Balance (INR)', 'Moratorium Status'];
  const rows = schedule.map(row => [
    row.period,
    `"${row.periodLabel}"`,
    row.openingBalance,
    row.interestPaid,
    row.principalPaid,
    row.totalInstallment,
    row.closingBalance,
    row.isMoratorium ? 'Active Moratorium' : 'Regular Repayment'
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
