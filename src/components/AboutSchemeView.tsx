import React from 'react';
import { Award, ShieldCheck, CheckCircle2, FileText, ArrowRight, DollarSign, Clock, Users } from 'lucide-react';
import { Language } from '../types';

interface AboutSchemeViewProps {
  language: Language;
  onStartAssessment: () => void;
  onOpenCalculator: () => void;
}

export const AboutSchemeView: React.FC<AboutSchemeViewProps> = ({
  language,
  onStartAssessment,
  onOpenCalculator
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="about-scheme-section">
      {/* Title Section */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Ministry of Social Justice and Empowerment Schemes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {language === 'hi'
              ? 'राष्ट्रीय रियायती वित्त पोषण योजनाएं: एक संपूर्ण परिचय'
              : 'Concessional Credit Schemes for Rural Entrepreneurs'}
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            {language === 'hi'
              ? 'सामाजिक न्याय और अधिकारिता मंत्रालय अपने तीन प्रमुख शीर्ष निगमों—राष्ट्रीय पिछड़ा वर्ग वित्त एवं विकास निगम (NBCFDC), राष्ट्रीय अनुसूचित जाति वित्त एवं विकास निगम (NSFDC) तथा राष्ट्रीय सफाई कर्मचारी वित्त एवं विकास निगम (NSKFDC)—के माध्यम से भारत के सामाजिक एवं आर्थिक रूप से पिछड़े वर्गों को रियायती दरों पर ऋण सहायता प्रदान करता है।'
              : 'The Ministry of Social Justice and Empowerment implements concessional credit schemes through its statutory apex corporations: NBCFDC, NSFDC, and NSKFDC. These schemes offer subsidized credit, low interest rates, and flexible moratorium holidays to promote self-reliance.'}
          </p>
        </div>
      </div>

      {/* Comparison Grid: Micro Finance Scheme vs Term Loan Scheme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scheme 1: Micro Finance Scheme */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs uppercase px-2.5 py-1 rounded-md">
              Category A
            </span>
            <span className="text-xs font-medium text-emerald-700">Projects up to ₹1.40 Lakh</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'माइक्रो फाइनेंस योजना (Micro Finance Scheme)' : 'Micro Finance Scheme'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tailored specifically for micro-income generating activities such as small dairy units, kirana shops, tailoring, poultry, and local village service enterprises.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Promoter Margin:</span>
              <span className="font-semibold text-slate-900">Only 10% of Project Cost</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Concessional Loan Share:</span>
              <span className="font-semibold text-emerald-700">90% of Project Cost</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Maximum Loan Amount:</span>
              <span className="font-semibold text-slate-900">Up to ₹1,25,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Annual Interest Rate:</span>
              <span className="font-bold text-slate-900 text-sm">6.5% p.a.</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Repayment Tenure:</span>
              <span className="font-semibold text-slate-900">3 Years (Quarterly Installments)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Moratorium Grace:</span>
              <span className="font-semibold text-amber-700">3 Months (Interest Only)</span>
            </div>
          </div>

          <button
            onClick={onStartAssessment}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 rounded-md transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Apply for Micro Finance</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scheme 2: General Term Loan Scheme */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs uppercase px-2.5 py-1 rounded-md">
              Category B
            </span>
            <span className="text-xs font-medium text-slate-600">Projects from ₹1.40 Lakh to ₹50 Lakh</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            {language === 'hi' ? 'मियादी ऋण योजना (General Term Loan)' : 'General Term Loan Scheme'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Designed for scaling micro-enterprises into small and medium units requiring capital machinery, commercial transport, processing plants, and expanded storage.
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Promoter Margin:</span>
              <span className="font-semibold text-slate-900">Only 10% of Project Cost</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Concessional Loan Share:</span>
              <span className="font-semibold text-emerald-700">Up to 90% of Project Cost</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Maximum Loan Amount:</span>
              <span className="font-semibold text-slate-900">Up to ₹45,00,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Annual Interest Rate:</span>
              <span className="font-bold text-slate-900 text-sm">8.0% p.a.</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Repayment Tenure:</span>
              <span className="font-semibold text-slate-900">Up to 7 Years (Quarterly)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Moratorium Grace:</span>
              <span className="font-semibold text-amber-700">6 Months (Interest Only)</span>
            </div>
          </div>

          <button
            onClick={onStartAssessment}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 rounded-md transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>Apply for Term Loan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Implementing Channel Partners */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold uppercase text-slate-700 tracking-wider">
          Channel Partners & Implementing Agencies
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The schemes are routed through State Channelising Agencies (SCAs) nominated by respective state governments, Regional Rural Banks (RRBs), Public Sector Commercial Banks, and selected Milk Cooperatives/Self-Help Group federations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <strong className="text-slate-900 block mb-1">State Channelising Agencies (SCAs)</strong>
            <span className="text-slate-500 text-[11px]">Primary point for caste verification, scheme counseling, and direct loan disbursement.</span>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <strong className="text-slate-900 block mb-1">Regional Rural Banks (RRBs)</strong>
            <span className="text-slate-500 text-[11px]">Specialized rural banking arms providing doorstep credit and passbook account linkages.</span>
          </div>
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <strong className="text-slate-900 block mb-1">District Industries Centres (DIC)</strong>
            <span className="text-slate-500 text-[11px]">Nodal district agency issuing enterprise registrations, approvals, and industrial subsidies.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
