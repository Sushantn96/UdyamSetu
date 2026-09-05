import React from 'react';
import { ExternalLink, Shield, Eye, FileText, Map, Heart } from 'lucide-react';
import { Language } from '../types';
import { AshokaEmblem } from './EmblemIcon';

interface FooterProps {
  language: Language;
  highContrast: boolean;
}

export const Footer: React.FC<FooterProps> = ({ language, highContrast }) => {
  return (
    <footer
      className={`border-t transition-colors ${
        highContrast
          ? 'bg-black text-amber-300 border-amber-600'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      }`}
      id="portal-footer"
    >
      {/* Tricolor divider strip */}
      <div className="w-full flex h-1" aria-hidden="true">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-slate-800 text-xs">
          {/* Col 1: Emblem & Ministry Overview */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-amber-400">
                <AshokaEmblem className="w-10 h-14" />
              </div>
              <div>
                <h4 className="font-semibold text-sm tracking-wide text-white">
                  {language === 'hi' ? 'उद्यम सेतु डिजिटल पोर्टल' : 'Udyam Setu Portal'}
                </h4>
                <p className="text-slate-400 text-[11px]">
                  {language === 'hi'
                    ? 'सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार'
                    : 'Ministry of Social Justice & Empowerment, Govt. of India'}
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {language === 'hi'
                ? 'ग्रामीण एवं अर्ध-शहरी सूक्ष्म उद्यमियों हेतु एआई आधारित स्थानीय व्यावसायिक परामर्श, व्यवहार्यता विश्लेषण एवं रियायती वित्तीय संरचना प्रणाली।'
                : 'AI-driven hyper-local advisory and concessional credit structuring platform for rural micro-entrepreneurs under NBCFDC, NSFDC, and NSKFDC statutory mandates.'}
            </p>
          </div>

          {/* Col 2: Official Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="font-semibold uppercase tracking-wider text-amber-400 text-xs">
              {language === 'hi' ? 'महत्वपूर्ण सरकारी पोर्टल' : 'Government Portals'}
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a
                  href="https://socialjustice.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>MoSJE Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>National Portal of India (india.gov.in)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://udyamregistration.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>Udyam MSME Registration</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition"
                >
                  <span>Agmarknet Mandi Price Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory & Transparency Links */}
          <div className="md:col-span-3 space-y-2">
            <h5 className="font-semibold uppercase tracking-wider text-amber-400 text-xs">
              {language === 'hi' ? 'नीति एवं पारदर्शिता' : 'Transparency & Policies'}
            </h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#rti" className="hover:text-white flex items-center gap-1.5 transition">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Right to Information (RTI Act)</span>
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-white flex items-center gap-1.5 transition">
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Accessibility Statement (GIGW Compliant)</span>
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white flex items-center gap-1.5 transition">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Privacy Policy & Aadhaar Token Security</span>
                </a>
              </li>
              <li>
                <a href="#sitemap" className="hover:text-white flex items-center gap-1.5 transition">
                  <Map className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sitemap & Help Manuals</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Visitor Statistics & Security */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-semibold uppercase tracking-wider text-amber-400 text-xs">
              {language === 'hi' ? 'पोर्टल सांख्यिकी' : 'Portal Analytics'}
            </h5>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 space-y-1 text-center">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">
                {language === 'hi' ? 'कुल आगंतुक संख्या' : 'Total Visitors'}
              </span>
              <span className="font-mono text-base font-bold text-amber-400 tracking-widest block">
                02,489,173
              </span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5">
              <p>Last Updated: 05 September 2026</p>
              <p>Version: 2.4.0 (GIGW 3.0 Standard)</p>
            </div>
          </div>
        </div>

        {/* Bottom NIC / Digital India Attribution Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            Designed, Developed and Hosted by National Informatics Centre (NIC) / MoSJE Digital Initiative Division.
          </p>
          <div className="flex items-center gap-4">
            <span>© 2026 Government of India. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
