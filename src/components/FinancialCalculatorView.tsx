import React, { useState, useMemo } from 'react';
import { 
  Calculator, IndianRupee, Clock, ShieldCheck, Download, Printer, 
  ArrowRight, PieChart as PieIcon, RefreshCw, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { 
  calculateFinancialScheme, 
  generateAmortizationSchedule, 
  formatCurrencyINR,
  AmortizationSchedule,
  SchemeDetails
} from '../utils/financeCalculator';
import { BUSINESS_CATEGORIES } from '../data/categoriesData';
import { Language } from '../types';

interface FinancialCalculatorViewProps {
  initialMarginCapital: number;
  businessCategoryId: string;
  language: Language;
  onApplyMarginCapital: (newMargin: number) => void;
}

export const FinancialCalculatorView: React.FC<FinancialCalculatorViewProps> = ({
  initialMarginCapital,
  businessCategoryId,
  language,
  onApplyMarginCapital
}) => {
  const [marginCapital, setMarginCapital] = useState<number>(initialMarginCapital || 12000);
  
  // Working capital expense inputs
  const [rawMaterials, setRawMaterials] = useState<number>(8000);
  const [rent, setRent] = useState<number>(2500);
  const [utilities, setUtilities] = useState<number>(1200);
  const [wages, setWages] = useState<number>(4000);
  const [misc, setMisc] = useState<number>(1500);

  // Sync calculation
  const calculation = useMemo(() => {
    return calculateFinancialScheme(marginCapital);
  }, [marginCapital]);

  const schedule: AmortizationSchedule = useMemo(() => {
    return generateAmortizationSchedule(
      calculation.maxLoanEligibility,
      calculation.scheme.interestRateAnnual,
      calculation.scheme.tenureYears,
      calculation.scheme.moratoriumMonths
    );
  }, [calculation]);

  // Working Capital Estimator
  const monthlyOperatingExpense = rawMaterials + rent + utilities + wages + misc;
  const threeMonthReserve = monthlyOperatingExpense * 3;

  // Selected Category info for capital allocation split
  const categoryInfo = BUSINESS_CATEGORIES.find((c) => c.id === businessCategoryId) || BUSINESS_CATEGORIES[0];
  const equipmentPercent = categoryInfo.typicalEquipmentPercent || 65;
  const workingCapPercent = categoryInfo.typicalWorkingCapitalPercent || 35;

  const equipmentCost = Math.round(calculation.totalProjectCost * (equipmentPercent / 100));
  const workingCapitalAllocation = calculation.totalProjectCost - equipmentCost;

  // CSV Export
  const handleDownloadCSV = () => {
    const headers = ["Quarter", "Period Label", "Opening Balance (₹)", "Interest Paid (₹)", "Principal Paid (₹)", "Quarterly Installment (₹)", "Closing Balance (₹)", "Notes"];
    const rows = schedule.installments.map((row) => [
      row.quarterNumber,
      `"${row.periodLabel}"`,
      row.openingBalance,
      row.interestPaid,
      row.principalPaid,
      row.installmentAmount,
      row.closingBalance,
      row.isMoratorium ? '"Moratorium (Interest Only)"' : '"Active Amortization"'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Udyam_Disha_Amortization_Schedule_${calculation.scheme.schemeId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6" id="financial-calculator-container">
      {/* Top Title Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-md">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'मॉड्यूल 2: वित्तीय संरचना एवं योजना रूटिंग' : 'Module 2: Scheme Auto-Router & Loan Structuring'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {language === 'hi' ? 'स्मार्ट वित्तीय कैलकुलेटर व ईएमआई सारणी' : 'MoSJE Concessional Financial Calculator'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi'
              ? 'स्वयं के अंशदान के आधार पर माइक्रो फाइनेंस अथवा टर्म लोन योजना का स्वतः चयन एवं त्रैमासिक ऋण सारणी।'
              : 'Auto-routes to Micro Finance or Term Loan Scheme based on margin capital, with moratorium-aware quarterly amortization.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2 rounded-md border border-slate-200 shadow-2xs transition"
            id="download-amort-csv-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2 rounded-md border border-slate-200 shadow-2xs transition"
            id="print-amort-btn"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Interactive Margin Capital Slider & Synced Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input & Scheme Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <label className="text-xs font-semibold uppercase text-slate-600 tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'स्वयं का उपलब्ध अंशदान (Margin Capital)' : 'Available Margin Capital'}</span>
              </label>
              <span className="text-xl font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                {formatCurrencyINR(marginCapital)}
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={5000}
              max={250000}
              step={2500}
              value={marginCapital}
              onChange={(e) => {
                const val = Number(e.target.value);
                setMarginCapital(val);
                onApplyMarginCapital(val);
              }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              id="calc-margin-slider"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>₹5,000 (Micro)</span>
              <span>₹50,000</span>
              <span>₹1,40,000 (Cutoff)</span>
              <span>₹2,50,000 (Term Loan)</span>
            </div>

            {/* Synced Numeric Input with Quick Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min={2000}
                  max={5000000}
                  step={1000}
                  value={marginCapital}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    setMarginCapital(val);
                    onApplyMarginCapital(val);
                  }}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                  id="calc-margin-number"
                />
              </div>

              {/* Preset Buttons */}
              <div className="flex gap-1.5">
                {[10000, 20000, 50000, 150000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setMarginCapital(preset);
                      onApplyMarginCapital(preset);
                    }}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition ${
                      marginCapital === preset
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    ₹{(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Auto-Router Verdict Box */}
            <div className={`p-4 rounded-xl border transition-all ${
              calculation.isMicroFinance
                ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-300 text-slate-950'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                  {calculation.isMicroFinance ? 'Scheme A: Micro Finance' : 'Scheme B: General Term Loan'}
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  Auto-Selected by Policy Rules
                </span>
              </div>

              <h3 className="text-base font-bold mb-1">
                {calculation.scheme.schemeName}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {calculation.scheme.description}
              </p>

              {/* Scheme Specs Pill Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-medium">
                <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase">Interest Rate</span>
                  <span className="text-slate-900 font-bold">{calculation.scheme.interestRateAnnual}% p.a.</span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase">Tenure</span>
                  <span className="text-slate-900 font-bold">{calculation.scheme.tenureYears} Years</span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase">Moratorium</span>
                  <span className="text-emerald-700 font-bold">{calculation.scheme.moratoriumMonths} Months</span>
                </div>
                <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block uppercase">Max Loan Cap</span>
                  <span className="text-slate-900 font-bold">₹{(calculation.scheme.maxLoanAmount / 100000).toFixed(1)} Lakh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Capital vs Equipment Split Box */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
                Recommended Capital Allocation Split ({categoryInfo.name})
              </h3>
              <span className="text-xs text-slate-400 font-medium">Industry Benchmark</span>
            </div>

            {/* Split Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-200">
              <div
                style={{ width: `${equipmentPercent}%` }}
                className="bg-slate-900 flex items-center justify-center text-[10px] text-white font-medium"
              >
                Fixed Assets ({equipmentPercent}%)
              </div>
              <div
                style={{ width: `${workingCapPercent}%` }}
                className="bg-amber-400 flex items-center justify-center text-[10px] text-slate-950 font-semibold"
              >
                Working Capital ({workingCapPercent}%)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Machinery / Livestock / Setup:</span>
                <span className="text-sm font-bold text-slate-900">{formatCurrencyINR(equipmentCost)}</span>
              </div>
              <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-medium">Initial Working Capital:</span>
                <span className="text-sm font-bold text-amber-700">{formatCurrencyINR(workingCapitalAllocation)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Working Capital Estimator & Summary */}
        <div className="lg:col-span-6 space-y-6">
          {/* Key Loan Figures Metric Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Approved MoSJE Concessional Financial Structure
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  Total Project Cost (100%)
                </span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrencyINR(calculation.totalProjectCost)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  Promoter Margin (10%)
                </span>
                <span className="text-2xl font-bold text-amber-400">
                  {formatCurrencyINR(calculation.promoterMargin)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  Loan Sanctioned (90%)
                </span>
                <span className="text-2xl font-bold text-emerald-400">
                  {formatCurrencyINR(calculation.maxLoanEligibility)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase block font-medium">
                  Est. Quarterly Installment
                </span>
                <span className="text-2xl font-bold text-slate-200">
                  {formatCurrencyINR(schedule.summary.averageQuarterlyInstallment)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
              <span>Total Interest Payable: <strong className="text-white font-medium">{formatCurrencyINR(schedule.summary.totalInterestPaid)}</strong></span>
              <span>Total Repayment: <strong className="text-white font-medium">{formatCurrencyINR(schedule.summary.totalRepaid)}</strong></span>
            </div>
          </div>

          {/* Working Capital Estimator */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
                Monthly Working Capital Estimator
              </h3>
              <span className="text-xs text-emerald-700 font-medium">Recommended 3-Month Buffer</span>
            </div>

            <p className="text-xs text-slate-500">
              Enter estimated monthly operating costs to calculate recommended working capital reserves:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Raw Materials (₹)</label>
                <input
                  type="number"
                  value={rawMaterials}
                  onChange={(e) => setRawMaterials(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Rent / Shed (₹)</label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Power & Fuel (₹)</label>
                <input
                  type="number"
                  value={utilities}
                  onChange={(e) => setUtilities(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Wages / Helpers (₹)</label>
                <input
                  type="number"
                  value={wages}
                  onChange={(e) => setWages(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-0.5">Transport & Misc (₹)</label>
                <input
                  type="number"
                  value={misc}
                  onChange={(e) => setMisc(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-medium text-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Monthly Total</span>
                <span className="font-bold text-slate-900">{formatCurrencyINR(monthlyOperatingExpense)}</span>
              </div>
            </div>

            {/* Comparison banner */}
            <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-amber-950 block">Recommended 3-Month Working Capital:</span>
                <span className="text-slate-600">₹{threeMonthReserve.toLocaleString('en-IN')} (Target Reserve)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Available in Loan Budget:</span>
                <span className="font-bold text-slate-900">{formatCurrencyINR(workingCapitalAllocation)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table with Moratorium Callout */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Quarterly Amortization Schedule (Reducing Balance)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reflects rural quarterly repayment schedule with initial {calculation.scheme.moratoriumMonths}-month moratorium holiday.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Moratorium Period: First {schedule.moratoriumQuarters} Quarter(s)</span>
            </span>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
            <thead className="bg-slate-900 text-white uppercase text-[11px] font-semibold sticky top-0">
              <tr>
                <th className="p-2.5">Qtr</th>
                <th className="p-2.5">Period Label</th>
                <th className="p-2.5">Opening Balance</th>
                <th className="p-2.5">Interest (Quarterly)</th>
                <th className="p-2.5">Principal Repaid</th>
                <th className="p-2.5">Total Installment</th>
                <th className="p-2.5">Closing Balance</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schedule.installments.map((row) => (
                <tr
                  key={row.quarterNumber}
                  className={row.isMoratorium ? 'bg-amber-50/50 font-medium' : 'hover:bg-slate-50'}
                >
                  <td className="p-2.5 font-bold text-slate-900">{row.quarterNumber}</td>
                  <td className="p-2.5 font-medium text-slate-700">{row.periodLabel}</td>
                  <td className="p-2.5">{formatCurrencyINR(row.openingBalance)}</td>
                  <td className="p-2.5 text-rose-700 font-medium">{formatCurrencyINR(row.interestPaid)}</td>
                  <td className="p-2.5 text-emerald-700 font-bold">{formatCurrencyINR(row.principalPaid)}</td>
                  <td className="p-2.5 font-bold text-slate-900">{formatCurrencyINR(row.installmentAmount)}</td>
                  <td className="p-2.5">{formatCurrencyINR(row.closingBalance)}</td>
                  <td className="p-2.5">
                    {row.isMoratorium ? (
                      <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Moratorium (Interest Only)
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Principal + Interest
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>
            * Calculations adhere to National Backward Classes / Scheduled Castes Finance & Development Corporation (NBCFDC/NSFDC) lending guidelines.
          </span>
          <span className="font-semibold text-slate-800">
            Formula: Quarterly reducing balance with moratorium grace
          </span>
        </div>
      </div>
    </div>
  );
};
