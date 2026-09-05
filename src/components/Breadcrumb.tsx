import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { NavTab } from './Navbar';
import { Language } from '../types';

interface BreadcrumbProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  language: Language;
  extraLabel?: string;
}

const TAB_TITLES: Record<NavTab, { en: string; hi: string }> = {
  home: { en: 'Home', hi: 'मुख्य पृष्ठ' },
  about: { en: 'About MoSJE Schemes', hi: 'योजना विवरण' },
  feasibility: { en: 'Hyper-Local Feasibility Report', hi: 'स्थानीय व्यवहार्यता रिपोर्ट' },
  calculator: { en: 'Smart Financial Calculator & Scheme Router', hi: 'वित्तीय कैलकुलेटर' },
  report: { en: 'Consolidated Business Plan (DPR)', hi: 'व्यावसायिक परियोजना रिपोर्ट' },
  contact: { en: 'Helplines & Grievance Redressal', hi: 'हेल्पलाइन एवं संपर्क' }
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentTab,
  onNavigate,
  language,
  extraLabel
}) => {
  if (currentTab === 'home') return null;

  return (
    <nav
      className="bg-slate-100/70 border-b border-slate-200/80 py-2 px-4 text-xs text-slate-500"
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto flex items-center space-x-2 flex-wrap">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 hover:text-slate-900 transition font-medium focus:outline-none focus:underline"
        >
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

        <span className="font-medium text-slate-800">
          {language === 'hi' ? TAB_TITLES[currentTab].hi : TAB_TITLES[currentTab].en}
        </span>

        {extraLabel && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-500">{extraLabel}</span>
          </>
        )}
      </div>
    </nav>
  );
};
