import React, { useState } from 'react';
import { 
  Printer, Download, Share2, FileCheck, CheckSquare, 
  MapPin, Phone, Building, Calendar, ArrowLeft, Award, Check 
} from 'lucide-react';
import { FeasibilityReport, UserProfile, LocalMarketContext, Language } from '../types';
import { calculateFinancialScheme, generateAmortizationSchedule, formatCurrencyINR } from '../utils/financeCalculator';
import { AshokaEmblem } from './EmblemIcon';

interface BusinessPlanReportViewProps {
  report: FeasibilityReport;
  profile: UserProfile;
  localContext: LocalMarketContext;
  language: Language;
  onBackToDashboard: () => void;
}

export const BusinessPlanReportView: React.FC<BusinessPlanReportViewProps> = ({
  report,
  profile,
  localContext,
  language,
  onBackToDashboard
}) => {
  const [copied, setCopied] = useState(false);

  const financial = calculateFinancialScheme(profile.marginCapital);
  const schedule = generateAmortizationSchedule(
    financial.maxLoanEligibility,
    financial.scheme.interestRateAnnual,
    financial.scheme.tenureYears,
    financial.scheme.moratoriumMonths
  );

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // ignore print error in restricted frames
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Udyam Setu - Business Plan for ${profile.name}`,
          text: `Official Detailed Project Report (DPR) for ${profile.businessCategory} under ${financial.scheme.schemeName}`,
          url: window.location.href
        });
        return;
      } catch (err) {
        // User cancelled or share not allowed
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // clipboard access denied in iframe
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6" id="business-plan-dpr-container">
      {/* Top Action Bar (hidden when printing) */}
      <div className="print:hidden bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस डैशबोर्ड पर जाएं' : 'Back to Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2 rounded-md border border-slate-200 shadow-2xs transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-md transition shadow-2xs"
            id="print-dpr-btn"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save as Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government Project Document Sheet */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-8 sm:p-12 text-slate-900 print:shadow-none print:border-none print:p-0 space-y-8 font-sans">
        {/* Tricolor Header Bar */}
        <div className="w-full flex h-1.5 rounded-full overflow-hidden" aria-hidden="true">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-slate-100 border-y border-slate-200"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        {/* Formal MoSJE Letterhead Header */}
        <div className="border-b border-slate-200 pb-6 text-center space-y-2">
          <div className="flex justify-center text-slate-900">
            <AshokaEmblem className="w-14 h-18" />
          </div>
          <h3 className="text-[11px] uppercase tracking-widest font-semibold text-slate-500">
            भारत सरकार | Government of India
          </h3>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wide">
            सामाजिक न्याय और अधिकारिता मंत्रालय
          </h1>
          <h2 className="text-sm font-semibold text-slate-700">
            Ministry of Social Justice and Empowerment (MoSJE)
          </h2>
          <p className="text-xs text-slate-500">
            National Backward Classes & Scheduled Castes Finance and Development Corporation (NBCFDC / NSFDC)
          </p>
          <div className="inline-block bg-slate-100 border border-slate-200 px-4 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-800 mt-2">
            Detailed Project Appraisal Report (DPR) & Business Advisory Plan
          </div>
        </div>

        {/* Metadata Registry Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50/80 border border-slate-200 rounded-lg text-xs">
          <div>
            <span className="text-slate-500 block uppercase font-medium text-[10px]">Application Ref ID:</span>
            <span className="font-mono font-bold text-slate-900">{report.id}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-medium text-[10px]">Appraisal Date:</span>
            <span className="font-semibold text-slate-900">{new Date(report.generatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-medium text-[10px]">Beneficiary Category:</span>
            <span className="font-semibold text-slate-900">{profile.category} Target</span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase font-medium text-[10px]">Aadhaar Masked Ref:</span>
            <span className="font-mono font-medium text-slate-700">{profile.aadhaarMasked}</span>
          </div>
        </div>

        {/* Section 1: Beneficiary Profile & Enterprise Location */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            1. Applicant Demographic & Geo-Location Data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p><strong className="text-slate-500 font-medium">Full Name:</strong> <span className="font-semibold text-slate-900">{profile.name}</span></p>
              <p><strong className="text-slate-500 font-medium">Mobile:</strong> <span className="text-slate-800">+91 {profile.mobile}</span></p>
              <p><strong className="text-slate-500 font-medium">Enterprise Classification:</strong> <span className="text-slate-800">Micro-Enterprise ({profile.businessCategory.replace('_', ' ').toUpperCase()})</span></p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-slate-500 font-medium">Village / Panchayat:</strong> <span className="text-slate-800">{profile.location.panchayat}</span></p>
              <p><strong className="text-slate-500 font-medium">Block / Tehsil:</strong> <span className="text-slate-800">{profile.location.block}</span></p>
              <p><strong className="text-slate-500 font-medium">District & State:</strong> <span className="text-slate-800">{profile.location.district}, {profile.location.state}</span></p>
            </div>
          </div>
        </div>

        {/* Section 2: Executive Summary (AI Generated) */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            2. Executive Project Summary
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-4 rounded-lg border border-slate-200 text-justify">
            {report.executiveSummary || report.verdictExplanation || report.pricingAndEconomics?.summary || 'Comprehensive feasibility assessment and commercial appraisal for micro-enterprise operations.'}
          </p>
        </div>

        {/* Section 3: Market Feasibility & Demand Appraisal */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            3. Local Market Feasibility & Scoring
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
            <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Feasibility Score</span>
              <span className="text-2xl font-bold text-slate-900">{report.feasibilityScore} / 100</span>
              <span className="text-[10px] block text-emerald-700 font-semibold mt-0.5">{report.verdict}</span>
            </div>
            <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">5km Catchment Population</span>
              <span className="text-xl font-bold text-slate-800">{report.marketReach.consumerBase5Km.toLocaleString('en-IN')}</span>
              <span className="text-[10px] block text-slate-500 mt-0.5">Census 2011 Village Registry</span>
            </div>
            <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Local Mandi Distance</span>
              <span className="text-xl font-bold text-slate-800">{localContext.distanceToMandiKm} km</span>
              <span className="text-[10px] block text-slate-500 mt-0.5">{localContext.nearestMandiName}</span>
            </div>
          </div>
        </div>

        {/* Section 4: SWOT Matrix */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            4. Enterprise SWOT Matrix
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <span className="font-semibold text-emerald-800 uppercase block mb-1">Strengths</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                {report.swot.strengths.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <span className="font-semibold text-amber-800 uppercase block mb-1">Weaknesses</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                {report.swot.weaknesses.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <span className="font-semibold text-slate-800 uppercase block mb-1">Opportunities</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                {report.swot.opportunities.slice(0, 3).map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </div>
            <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50">
              <span className="font-semibold text-rose-800 uppercase block mb-1">Threats & Mitigation</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                {report.threats.slice(0, 2).map((t, i) => <li key={i}>{t.riskName} ({t.severity} Severity)</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5: Financial Structuring & Scheme Details */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            5. Approved Financial Structuring Plan
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
              <tbody className="divide-y divide-slate-200">
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-600 w-1/2">Selected Concessional Scheme:</td>
                  <td className="p-2.5 font-bold text-slate-900">{financial.scheme.schemeName}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-600">Total Recommended Project Cost:</td>
                  <td className="p-2.5 font-bold text-slate-900">{formatCurrencyINR(financial.totalProjectCost)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-600">Promoter Margin Capital (10%):</td>
                  <td className="p-2.5 font-bold text-amber-700">{formatCurrencyINR(financial.promoterMargin)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-600">Term Loan Sanction Recommended (90%):</td>
                  <td className="p-2.5 font-bold text-emerald-800">{formatCurrencyINR(financial.maxLoanEligibility)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-600">Concessional Annual Interest Rate:</td>
                  <td className="p-2.5 font-bold text-slate-900">{financial.scheme.interestRateAnnual}% p.a.</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-slate-600">Repayment Tenure & Frequency:</td>
                  <td className="p-2.5 text-slate-700">{financial.scheme.tenureYears} Years (Quarterly Amortization)</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-600">Approved Moratorium Period:</td>
                  <td className="p-2.5 font-bold text-slate-900">{financial.scheme.moratoriumMonths} Months (Interest-only repayment)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: First Year Amortization Schedule Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            6. Year 1 Quarterly Repayment Schedule
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 uppercase text-[10px] font-semibold text-slate-700">
                <tr>
                  <th className="p-2.5">Period</th>
                  <th className="p-2.5">Opening Loan</th>
                  <th className="p-2.5">Interest</th>
                  <th className="p-2.5">Principal</th>
                  <th className="p-2.5">Installment</th>
                  <th className="p-2.5">Closing Loan</th>
                  <th className="p-2.5">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedule.installments.slice(0, 4).map((row) => (
                  <tr key={row.quarterNumber}>
                    <td className="p-2.5 font-bold text-slate-900">Q{row.quarterNumber}</td>
                    <td className="p-2.5">{formatCurrencyINR(row.openingBalance)}</td>
                    <td className="p-2.5 text-rose-700 font-medium">{formatCurrencyINR(row.interestPaid)}</td>
                    <td className="p-2.5 text-emerald-700 font-semibold">{formatCurrencyINR(row.principalPaid)}</td>
                    <td className="p-2.5 font-bold text-slate-900">{formatCurrencyINR(row.installmentAmount)}</td>
                    <td className="p-2.5">{formatCurrencyINR(row.closingBalance)}</td>
                    <td className="p-2.5 text-[10px] font-semibold text-amber-800">{row.isMoratorium ? 'Moratorium' : 'Regular'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 7: Action Checklist & Bank Next Steps */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1.5">
            7. Mandatory Document Checklist for DIC / Channel Partner Submission
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              "Aadhaar Card & Proof of Identity (self-attested copy)",
              "Caste Certificate issued by Competent Revenue Authority (for SC/OBC/DNT concessions)",
              "Proof of Residence / Panchayat Pradhan Bonafide Certificate",
              "Bank Account Passbook (showing 10% margin deposit in saving account)",
              "Quotations/Proforma Invoice for Machinery / Equipment / Livestock from registered vendor",
              "Udyam Setu Project Feasibility Appraisal Report (this printed document)"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-slate-50/80 p-2.5 rounded-md border border-slate-200">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Disclaimer and Signature Block */}
        <div className="pt-6 border-t border-slate-300 text-xs text-slate-600 space-y-6">
          <p className="text-[10px] text-slate-500 text-justify">
            <strong>Official Disclaimer:</strong> This document is generated through the Ministry of Social Justice and Empowerment (MoSJE) "Udyam Setu" AI Digital Advisory Portal. Loan sanctions are subject to statutory verification of caste credentials, physical site inspection by the State Channelising Agency (SCA) / Regional Rural Bank (RRB) / Lead Bank, and adherence to NBCFDC/NSFDC operational guidelines.
          </p>

          <div className="flex justify-between items-end pt-4">
            <div className="text-left space-y-1">
              <div className="w-40 border-b border-slate-300"></div>
              <p className="font-semibold text-slate-800">Signature of Applicant</p>
              <p className="text-[10px] text-slate-500">Name: {profile.name}</p>
            </div>

            <div className="text-center space-y-1">
              <div className="inline-block border border-slate-300 p-2 rounded-md text-[10px] font-semibold text-slate-700 bg-slate-50">
                Digitally Appraised by<br />Udyam Setu AI Engine
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="w-40 border-b border-slate-300 ml-auto"></div>
              <p className="font-semibold text-slate-800">Branch Officer / SCA Seal</p>
              <p className="text-[10px] text-slate-500">District: {profile.location.district}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
