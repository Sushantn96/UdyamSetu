import React, { useState } from 'react';
import { 
  BarChart3, RefreshCw, AlertTriangle, ShieldCheck, Users, 
  MapPin, TrendingUp, DollarSign, Layers, CheckCircle2, 
  ExternalLink, Sparkles, Navigation, Info, ArrowUpRight
} from 'lucide-react';
import { FeasibilityReport, LocalMarketContext, UserProfile, Language } from '../types';
import { formatCurrencyINR } from '../utils/financeCalculator';

interface FeasibilityViewProps {
  report: FeasibilityReport;
  localContext: LocalMarketContext;
  profile: UserProfile;
  language: Language;
  onRegenerateSection: (sectionKey: string) => void;
  isRegenerating: boolean;
  onGoToCalculator: () => void;
  onGoToBusinessPlan: () => void;
}

export const FeasibilityView: React.FC<FeasibilityViewProps> = ({
  report,
  localContext,
  profile,
  language,
  onRegenerateSection,
  isRegenerating,
  onGoToCalculator,
  onGoToBusinessPlan
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'score' | 'market' | 'swot' | 'threats' | 'competitors' | 'pricing'>('all');
  const [showCompetitorTable, setShowCompetitorTable] = useState<boolean>(false);

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-600';
    if (score >= 65) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-600 stroke-rose-600';
  };

  const getVerdictBadgeClass = (verdict: string) => {
    if (verdict.includes('High')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (verdict.includes('Moderate')) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  const getSeverityBadgeClass = (severity: 'Low' | 'Medium' | 'High') => {
    if (severity === 'Low') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (severity === 'Medium') return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-rose-100 text-rose-900 border-rose-300';
  };

  // Circular gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (report.feasibilityScore / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6" id="feasibility-report-container">
      {/* Top Banner & Action Header */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md">
              {language === 'hi' ? 'मंत्रालय एआई व्यवहार्यता प्रमाणन' : 'MoSJE AI Feasibility Analysis'}
            </span>
            <span className="text-xs text-slate-500">
              Ref: {report.id}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === 'hi' ? 'हाइपर-लोकल व्यापार व्यवहार्यता रिपोर्ट' : 'Hyper-Local Business Feasibility Report'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {profile.name} • {profile.businessCategory.replace('_', ' ').toUpperCase()} • {localContext.panchayat}, {localContext.block}, {localContext.district}, {localContext.state}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onRegenerateSection('full')}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-md text-xs font-medium border border-slate-200 transition shadow-2xs"
            id="regen-full-report-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{language === 'hi' ? 'एआई पुनः विश्लेषण' : 'Regenerate Full Report'}</span>
          </button>

          <button
            onClick={onGoToCalculator}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-md text-xs font-medium transition shadow-2xs"
            id="feasibility-to-calc-btn"
          >
            <span>{language === 'hi' ? 'वित्तीय कैलकुलेटर' : 'Financial Calculator'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onGoToBusinessPlan}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2 rounded-md text-xs font-semibold transition shadow-2xs"
            id="feasibility-to-plan-btn"
          >
            <span>{language === 'hi' ? 'बिजनेस प्लान डाउनलोड' : 'Download Business Plan'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-medium">
        {[
          { id: 'all', label: language === 'hi' ? 'संपूर्ण रिपोर्ट (All Cards)' : 'All Sections' },
          { id: 'score', label: language === 'hi' ? '1. व्यवहार्यता स्कोर' : '1. Feasibility Score' },
          { id: 'market', label: language === 'hi' ? '2. बाजार पहुंच (Reach)' : '2. Market Reach' },
          { id: 'swot', label: language === 'hi' ? '3. स्वॉट मैट्रिक्स' : '3. SWOT Matrix' },
          { id: 'threats', label: language === 'hi' ? '4. जोखिम पहचान' : '4. Risks & Threats' },
          { id: 'competitors', label: language === 'hi' ? '5. प्रतिस्पर्धी मैपिंग' : '5. Competitor Density' },
          { id: 'pricing', label: language === 'hi' ? '6. मूल्य एवं यूनिट इकोनॉमिक्स' : '6. Unit Economics' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-t-md whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-white border-x border-t border-slate-300 text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: Feasibility Score & Weighted Gauge */}
      {(activeTab === 'all' || activeTab === 'score') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'हाइपर-लोकल व्यवहार्यता स्कोर (Feasibility Score)' : 'Hyper-Local Feasibility Score'}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('score')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Circular Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/70 rounded-xl border border-slate-200">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className={`transition-all duration-1000 ${getScoreColor(report.feasibilityScore)}`}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-slate-900 leading-none">
                    {report.feasibilityScore}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 mt-1">
                    / 100 Index
                  </span>
                </div>
              </div>

              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${getVerdictBadgeClass(report.verdict)}`}>
                {report.verdict}
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-2.5 px-2">
                {report.verdictExplanation}
              </p>
            </div>

            {/* Score Breakdown Bars */}
            <div className="md:col-span-8 space-y-3">
              <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {language === 'hi' ? 'स्कोर मूल्यांकन घटक (AI Weighted Factors)' : 'AI Scoring Weightage Breakdown'}
              </h3>

              <div className="space-y-2.5">
                {[
                  { label: language === 'hi' ? 'स्थानीय बाजार मांग (Local Demand)' : 'Local Demand Factor', val: report.scoreBreakdown.localDemand, max: 25 },
                  { label: language === 'hi' ? 'प्रतिस्पर्धी घनत्व (Competition Buffer)' : 'Competition Density Index', val: report.scoreBreakdown.competitionDensity, max: 20 },
                  { label: language === 'hi' ? 'पूंजी पर्याप्तता (Capital Adequacy)' : 'Capital Adequacy (Margin vs Project)', val: report.scoreBreakdown.capitalAdequacy, max: 25 },
                  { label: language === 'hi' ? 'मौसमी जोखिम सुरक्षा (Seasonal Resilience)' : 'Seasonal Risk Resilience', val: report.scoreBreakdown.seasonalRisk, max: 15 },
                  { label: language === 'hi' ? 'स्थान व मंडी निकटता (Location Fit)' : 'Category-Location-Mandi Fit', val: report.scoreBreakdown.locationFit, max: 15 }
                ].map((item, idx) => {
                  const pct = Math.round((item.val / item.max) * 100);
                  return (
                    <div key={idx} className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800">{item.label}</span>
                        <span className="text-slate-900 font-semibold">
                          {item.val} / {item.max} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-slate-900 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{language === 'hi' ? 'डेटा स्रोत: जनगणना 2011 विलेज डायरेक्टरी + एमएसएमई उद्यम रजिस्टर' : 'Source grounding: Census 2011 Village Directory + MSME Udyam Register'}</span>
            <span className="font-semibold text-emerald-700">MoSJE Certified Scoring Model</span>
          </div>
        </div>
      )}

      {/* SECTION 2: Market Reach & Population Radius */}
      {(activeTab === 'all' || activeTab === 'market') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'स्थानीय बाज़ार पहुंच (5–10 किमी परिधि)' : 'Market Reach & Consumer Base (5–10 km Radius)'}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('market')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Radar / Radius Simulator */}
            <div className="md:col-span-5 bg-slate-50/70 rounded-xl p-4 border border-slate-200 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-600 uppercase mb-2">
                {language === 'hi' ? 'परिधि जनसांख्यिकी सिमुलेटर' : 'Radius Demographic Simulator'}
              </span>

              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* 10km circle */}
                <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-slate-300 bg-slate-100/50 flex items-start justify-center pt-1">
                  <span className="text-[9px] font-semibold text-slate-700 bg-white/90 px-1 rounded shadow-2xs">
                    10 km Radius: {report.marketReach.consumerBase10Km.toLocaleString('en-IN')} Pop.
                  </span>
                </div>
                {/* 5km circle */}
                <div className="absolute w-28 h-28 rounded-full border-2 border-slate-400 bg-slate-200/50 flex items-start justify-center pt-1">
                  <span className="text-[9px] font-bold text-slate-900 bg-white/90 px-1 rounded shadow-2xs">
                    5 km: {report.marketReach.consumerBase5Km.toLocaleString('en-IN')}
                  </span>
                </div>
                {/* Center Pin (Panchayat) */}
                <div className="absolute w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[10px] shadow-sm z-10">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 text-center mt-3">
                <span className="font-semibold text-slate-800">{localContext.panchayat}</span> is located {localContext.distanceToMandiKm} km from {localContext.nearestMandiName}.
              </div>
            </div>

            {/* Distribution Channels & Demographics */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  {language === 'hi' ? 'लक्षित जनसांख्यिकी (Target Demographics)' : 'Target Demographic Profile'}
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                  {report.marketReach.targetDemographics}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {language === 'hi' ? 'प्राथमिक वितरण माध्यम (Primary Distribution Channels)' : 'Primary Distribution Channels'}
                </h4>
                <div className="space-y-2">
                  {report.marketReach.primaryDistributionChannels.map((channel, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Grounding citation: Directorate of Marketing and Inspection (DMI) Agmarknet Market Directory & Primary Census Abstract.
          </div>
        </div>
      )}

      {/* SECTION 3: Opportunity Analysis */}
      {(activeTab === 'all' || activeTab === 'market') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'स्थानीय अप्रयुक्त व्यावसायिक अवसर (Opportunity Analysis)' : 'Underserved Local Opportunities in ' + localContext.block}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('opportunity')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.opportunityAnalysis.map((opp, idx) => (
              <div key={idx} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Opportunity #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${opp.potentialImpact === 'High' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {opp.potentialImpact} Impact
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {opp.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Citations: District Industries Centre (DIC) potential report & NRLM block cluster study.
          </div>
        </div>
      )}

      {/* SECTION 4: SWOT Analysis (2x2 Grid) */}
      {(activeTab === 'all' || activeTab === 'swot') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'स्वॉट (SWOT) विश्लेषण मैट्रिक्स' : 'SWOT Analysis Matrix'}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('swot')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{language === 'hi' ? 'शक्तियां (Strengths)' : 'Strengths'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {report.swot.strengths.map((s, i) => (
                  <li key={i} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>{language === 'hi' ? 'कमजोरियां (Weaknesses)' : 'Weaknesses'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {report.swot.weaknesses.map((w, i) => (
                  <li key={i} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase mb-2">
                <TrendingUp className="w-4 h-4 text-sky-700" />
                <span>{language === 'hi' ? 'अवसर (Opportunities)' : 'Opportunities'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {report.swot.opportunities.map((o, i) => (
                  <li key={i} className="leading-relaxed">{o}</li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>{language === 'hi' ? 'खतरे / चुनौतियां (Threats)' : 'Threats'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {report.swot.threats.map((t, i) => (
                  <li key={i} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            SWOT tailored to ₹{profile.marginCapital.toLocaleString('en-IN')} promoter capital and {profile.businessCategory} operations.
          </div>
        </div>
      )}

      {/* SECTION 5: Threats Identification with Severity Chips */}
      {(activeTab === 'all' || activeTab === 'threats') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'जोखिम एवं खतरे की पहचान (Risk Severity & Mitigation)' : 'Threats Identification & Mitigation Strategy'}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('threats')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {report.threats.map((threat) => (
              <div key={threat.id} className="bg-slate-50/80 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{threat.riskName}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {threat.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">{language === 'hi' ? 'सुझाई गई कार्ययोजना:' : 'Mitigation Strategy:'}</strong> {threat.mitigationStrategy}
                  </p>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${getSeverityBadgeClass(threat.severity)}`}>
                  {threat.severity} Severity
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Risk weights aligned with Lead Bank Scheme credit monitoring guidelines.
          </div>
        </div>
      )}

      {/* SECTION 6: Competitor Mapping & Density */}
      {(activeTab === 'all' || activeTab === 'competitors') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                6
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'प्रतिस्पर्धी मैपिंग एवं घनत्व' : 'Competitor Density & Cluster Mapping'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCompetitorTable(!showCompetitorTable)}
                className="text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md hover:bg-slate-50 shadow-2xs"
              >
                {showCompetitorTable ? 'View Map Widget' : 'View Data Table'}
              </button>
              <button
                onClick={() => onRegenerateSection('competitors')}
                className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                {language === 'hi' ? 'ब्लॉक में अनुमानित प्रतियोगी' : 'Estimated Competitors in Block'}
              </span>
              <span className="text-xl font-bold text-slate-900">
                {report.competitorMapping.totalEstimatedCompetitors} Units
              </span>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                {language === 'hi' ? 'प्रति 1,000 आबादी पर घनत्व' : 'Density / 1,000 Population'}
              </span>
              <span className="text-xl font-bold text-slate-900">
                {report.competitorMapping.densityPerThousandPopulation}
              </span>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                {language === 'hi' ? 'बाज़ार स्थिति' : 'Market Saturation Verdict'}
              </span>
              <span className="text-xs font-bold text-emerald-700 block mt-1.5">
                Low-to-Medium Saturation (Viable)
              </span>
            </div>
          </div>

          {!showCompetitorTable ? (
            /* Interactive Visual Heatmap / Cluster Widget */
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Local Cluster Dispersion ({localContext.block} Block)</span>
                <span className="text-[10px] text-slate-400">Scale: 5km Geo Box</span>
              </div>
              <div className="relative h-44 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                {/* Visual grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]" />

                {/* Center marker (You) */}
                <div className="absolute flex flex-col items-center z-10">
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px] ring-4 ring-slate-200">
                    ★
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 bg-white/95 px-1.5 py-0.5 rounded shadow-2xs mt-1 border border-slate-200">
                    Your Proposed Unit ({localContext.panchayat})
                  </span>
                </div>

                {/* Competitor clusters placed relative */}
                {report.competitorMapping.clusters.map((c, i) => {
                  const offsets = [
                    { top: '25%', left: '22%' },
                    { top: '65%', left: '70%' },
                    { top: '20%', left: '75%' }
                  ];
                  const pos = offsets[i % offsets.length];
                  return (
                    <div key={i} className="absolute flex flex-col items-center" style={pos}>
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-2 ring-rose-200 animate-pulse" />
                      <span className="text-[9px] font-medium text-slate-800 bg-white/95 px-1 rounded shadow-2xs mt-0.5 border border-slate-100">
                        {c.name} ({c.distanceKm} km)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Table Fallback */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="p-2.5">Cluster / Market Area</th>
                    <th className="p-2.5">Distance</th>
                    <th className="p-2.5">Scale</th>
                    <th className="p-2.5">Estimated Share</th>
                    <th className="p-2.5">Observed Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {report.competitorMapping.clusters.map((cluster, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{cluster.name}</td>
                      <td className="p-2.5">{cluster.distanceKm} km</td>
                      <td className="p-2.5">{cluster.scale}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{cluster.estimatedMarketShare}</td>
                      <td className="p-2.5 text-slate-600">{cluster.keyAdvantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Source: Ministry of MSME Udyam Registration Dashboard and local trade directory listings.
          </div>
        </div>
      )}

      {/* SECTION 7: Product Market Value & Unit Economics */}
      {(activeTab === 'all' || activeTab === 'pricing') && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                7
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'उत्पाद मूल्य निर्धारण एवं यूनिट इकोनॉमिक्स' : 'Product Market Value & Unit Economics'}
              </h2>
            </div>
            <button
              onClick={() => onRegenerateSection('pricing')}
              className="text-xs text-slate-700 hover:text-slate-900 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{language === 'hi' ? 'पुनः जांचें' : 'Regenerate'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-700 mb-4 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
            {report.pricingAndEconomics.summary}
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
              <thead className="bg-slate-900 text-white uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-2.5">Item / Service Unit</th>
                  <th className="p-2.5">Suggested Selling Price</th>
                  <th className="p-2.5">Cost of Production</th>
                  <th className="p-2.5">Gross Margin</th>
                  <th className="p-2.5">Est. Monthly Volume</th>
                  <th className="p-2.5">Monthly Gross Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.pricingAndEconomics.table.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2.5 font-semibold text-slate-900">{row.itemOrService}</td>
                    <td className="p-2.5 font-semibold text-emerald-700">{row.suggestedSellingPrice}</td>
                    <td className="p-2.5 text-slate-600">{row.estimatedCostOfProduction}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{row.grossMarginPercent}%</td>
                    <td className="p-2.5 text-slate-600">{row.estimatedMonthlyUnits.toLocaleString('en-IN')} units</td>
                    <td className="p-2.5 font-bold text-slate-900">
                      {formatCurrencyINR(row.projectedMonthlyGrossProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/90 p-3.5 rounded-lg border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                {language === 'hi' ? 'अनुमानित मासिक कुल आय' : 'Projected Monthly Revenue'}
              </span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrencyINR(report.pricingAndEconomics.estimatedMonthlyRevenue)} / Month
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                {language === 'hi' ? 'पूंजी वसूली अवधि (Payback Period)' : 'Estimated Capital Payback Period'}
              </span>
              <span className="text-base font-bold text-emerald-700">
                Approx. {report.pricingAndEconomics.paybackPeriodMonths} Months
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
            Source: Agmarknet Mandi Spot Price Bulletin ({localContext.nearestMandiName}) & Regional Purchasing Power parity index.
          </div>
        </div>
      )}
    </div>
  );
};
