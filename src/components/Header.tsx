import React from 'react';
import { AshokaEmblem } from './EmblemIcon';
import { UdyamSetuLogo } from './UdyamSetuLogo';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  highContrast: boolean;
}

export const Header: React.FC<HeaderProps> = ({ language, highContrast }) => {
  return (
    <header
      className={`border-b ${
        highContrast
          ? 'bg-black text-amber-300 border-amber-600'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
      id="portal-header"
    >
      {/* Tricolor Strip at very top */}
      <div className="w-full flex h-1" aria-hidden="true">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white border-y border-slate-200"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Main Official Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* LEFT: Udyam Setu Big Custom Logo & Identity (Shifted Right to Left) */}
        <div className="flex items-center gap-3 text-left">
          <UdyamSetuLogo size="lg" />
        </div>

        {/* RIGHT: Government of India & Ministry Identity (Shifted Left to Right) */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end text-center md:text-right">
          {/* Official Campaign Badges: Digital India, Skill India, Amrit Mahotsav */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Digital India emblem badge */}
            <div className="border border-slate-200 rounded-md px-2.5 py-1 bg-slate-50/80 text-center text-slate-800 shadow-2xs">
              <div className="text-[9px] font-bold tracking-tight text-slate-800 uppercase">
                Digital India
              </div>
              <div className="text-[8px] text-slate-500">Power To Empower</div>
            </div>

            {/* Skill India emblem badge */}
            <div className="border border-slate-200 rounded-md px-2.5 py-1 bg-slate-50/80 text-center text-slate-800 shadow-2xs">
              <div className="text-[9px] font-bold tracking-tight text-amber-700 uppercase">
                Skill India
              </div>
              <div className="text-[8px] text-slate-500">कौशल भारत</div>
            </div>

            {/* Azadi Ka Amrit Mahotsav badge */}
            <div className="border border-slate-200 rounded-md px-2.5 py-1 bg-amber-50/50 text-center text-amber-950 shadow-2xs">
              <div className="text-[9px] font-bold text-amber-800">75+</div>
              <div className="text-[8px] text-slate-500">Amrit Mahotsav</div>
            </div>
          </div>

          {/* Ministry Wordmark + National Ashoka Emblem */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="text-right">
              <h2 className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
                {language === 'hi' ? 'भारत सरकार' : 'Government of India'}
              </h2>
              <h1 className="text-xs sm:text-sm font-bold leading-snug text-slate-800">
                {language === 'hi'
                  ? 'सामाजिक न्याय और अधिकारिता मंत्रालय'
                  : 'Ministry of Social Justice and Empowerment'}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {language === 'hi'
                  ? 'राष्ट्रीय पिछड़ा वर्ग एवं अनुसूचित जाति वित्त एवं विकास निगम (NBCFDC / NSFDC)'
                  : 'National Backward Classes & Scheduled Castes Finance Corp'}
              </p>
            </div>
            {/* Ashoka Emblem with softened, minimized blue contrast */}
            <div className="shrink-0 text-slate-700 dark:text-amber-400 pl-2 border-l border-slate-200">
              <AshokaEmblem className="w-10 h-13 sm:w-12 sm:h-15 text-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
