import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, TrendingUp, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HeroBannerProps {
  language: Language;
  onStartAssessment: () => void;
  onOpenCalculator: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  onStartAssessment,
  onOpenCalculator
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badgeEn: "Government Concessional Credit",
      badgeHi: "सरकारी रियायती ऋण सहायता",
      titleEn: "Micro Finance Scheme for Rural Micro-Enterprises",
      titleHi: "ग्रामीण सूक्ष्म उद्यमों हेतु 'माइक्रो फाइनेंस योजना'",
      subtitleEn: "Concessional credit at 6.5% p.a. with 3-month moratorium for project costs up to ₹1.40 Lakh. Up to 90% loan coverage.",
      subtitleHi: "₹1.40 लाख तक की परियोजनाओं हेतु मात्र 6.5% वार्षिक ब्याज दर, 3 वर्ष की अवधि व 3 माह का मोराटोरियम अवकाश। 90% तक ऋण सहायता।",
      highlight1En: "Promoter Margin: Only 10%",
      highlight1Hi: "स्वयं का अंशदान: मात्र 10%",
      highlight2En: "Tenure: 3 Years (Quarterly)",
      highlight2Hi: "अवधि: 3 वर्ष (त्रैमासिक)",
      highlight3En: "Max Loan: ₹1.25 Lakh",
      highlight3Hi: "अधिकतम ऋण: ₹1.25 लाख",
      schemeType: "MICRO_FINANCE"
    },
    {
      badgeEn: "Enterprise Expansion & Upgradation",
      badgeHi: "उद्यम विस्तार एवं संवर्धन",
      titleEn: "General Term Loan Scheme for Growth Ventures",
      titleHi: "विकासोन्मुख व्यवसायों हेतु 'सामान्य मियादी ऋण (टर्म लोन)'",
      subtitleEn: "Scalable funding from ₹1.40 Lakh up to ₹50.00 Lakh at 8.0% p.a. with 6-month moratorium and 7-year flexible repayment.",
      subtitleHi: "₹1.40 लाख से ₹50.00 लाख तक की परियोजनाओं हेतु मात्र 8.0% ब्याज दर, 7 वर्ष की अवधि व 6 माह का मोराटोरियम अवकाश।",
      highlight1En: "Project Cost: Up to ₹50 Lakh",
      highlight1Hi: "परियोजना लागत: ₹50 लाख तक",
      highlight2En: "Tenure: 7 Years (Quarterly)",
      highlight2Hi: "अवधि: 7 वर्ष (त्रैमासिक)",
      highlight3En: "Max Loan: ₹45.00 Lakh",
      highlight3Hi: "अधिकतम ऋण: ₹45.00 लाख",
      schemeType: "TERM_LOAN"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Slide Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-amber-400 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? slide.badgeHi : slide.badgeEn}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug text-white">
              {language === 'hi' ? slide.titleHi : slide.titleEn}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              {language === 'hi' ? slide.subtitleHi : slide.subtitleEn}
            </p>

            {/* Highlight Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-medium text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? slide.highlight1Hi : slide.highlight1En}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-medium text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? slide.highlight2Hi : slide.highlight2En}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-medium text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'hi' ? slide.highlight3Hi : slide.highlight3En}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onStartAssessment}
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold px-4 py-2.5 rounded-md shadow-xs transition text-xs sm:text-sm"
                id="hero-start-assessment-btn"
              >
                <span>{language === 'hi' ? 'अपनी पात्रता व रिपोर्ट जांचें' : 'Start Feasibility Assessment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium px-4 py-2.5 rounded-md transition text-xs sm:text-sm"
                id="hero-open-calculator-btn"
              >
                <span>{language === 'hi' ? 'ईएमआई कैलकुलेटर' : 'Financial Calculator'}</span>
              </button>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                {language === 'hi' ? 'मंत्रालय सहयोग दिशानिर्देश' : 'MoSJE Concessional Highlights'}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-slate-300">{language === 'hi' ? 'स्वयं का अंशदान (Margin)' : 'Promoter Margin:'}</span>
                <span className="font-semibold text-white">10%</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-slate-300">{language === 'hi' ? 'सरकारी ऋण हिस्सा' : 'Loan Coverage:'}</span>
                <span className="font-semibold text-emerald-400">90% of Project Cost</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/10">
                <span className="text-slate-300">{language === 'hi' ? 'ब्याज दर' : 'Interest Rate:'}</span>
                <span className="font-semibold text-amber-400">6.5% - 8.0% p.a.</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-300">{language === 'hi' ? 'मोराटोरियम (राहत)' : 'Moratorium Period:'}</span>
                <span className="font-semibold text-white">3 to 6 Months</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-2.5 text-[11px] text-slate-300 border border-white/10 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === 'hi'
                  ? 'स्थानीय बाजार मांग, प्रतिस्पर्धी घनत्व एवं मंडी दरों पर आधारित तुरंत डिजिटल व्यवहार्यता।'
                  : 'Instant digital feasibility computed from Census population, Agmarknet mandi spot rates, and competitor density.'}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-6 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/15 text-white transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-1.5 rounded-md bg-white/10 hover:bg-white/15 text-white transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
