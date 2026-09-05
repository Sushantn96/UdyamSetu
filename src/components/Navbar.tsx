import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, BarChart3, Calculator, FileCheck, MessageSquareText, PhoneCall } from 'lucide-react';
import { Language } from '../types';

export type NavTab = 'home' | 'about' | 'feasibility' | 'calculator' | 'report' | 'contact';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: Language;
  highContrast: boolean;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  language,
  highContrast,
  onOpenChatbot
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'home' as NavTab,
      labelEn: 'Home',
      labelHi: 'मुख्य पृष्ठ (होम)',
      icon: Home
    },
    {
      id: 'about' as NavTab,
      labelEn: 'About the Scheme',
      labelHi: 'योजना विवरण',
      icon: BookOpen
    },
    {
      id: 'feasibility' as NavTab,
      labelEn: 'Feasibility Report',
      labelHi: 'व्यवहार्यता रिपोर्ट',
      icon: BarChart3
    },
    {
      id: 'calculator' as NavTab,
      labelEn: 'Financial Calculator',
      labelHi: 'वित्तीय कैलकुलेटर',
      icon: Calculator
    },
    {
      id: 'report' as NavTab,
      labelEn: 'My Business Plan',
      labelHi: 'व्यावसायिक योजना',
      icon: FileCheck
    },
    {
      id: 'contact' as NavTab,
      labelEn: 'Contact & Helplines',
      labelHi: 'संपर्क एवं सहायता',
      icon: PhoneCall
    }
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-40 transition-colors ${
        highContrast
          ? 'bg-stone-900 border-b-2 border-amber-500 text-amber-300'
          : 'bg-slate-900 text-slate-200 border-b border-slate-800 shadow-xs'
      }`}
      aria-label="Main Navigation"
      id="main-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/10 text-white font-semibold shadow-2xs border-b-2 border-amber-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                id={`nav-link-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Right Help button triggering AI Sahayak */}
        <div className="hidden md:flex items-center py-1">
          <button
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-md text-xs font-semibold transition shadow-2xs"
            id="nav-ai-sahayak-btn"
          >
            <MessageSquareText className="w-3.5 h-3.5 text-slate-950" />
            <span>{language === 'hi' ? 'उद्यम मित्र (AI Sahayak)' : 'Udyam Mitra AI'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center justify-between w-full py-2.5">
          <span className="font-semibold text-sm tracking-wide text-amber-400 flex items-center gap-1.5">
            <span>उद्यम सेतु</span>
            <span className="text-slate-500">|</span>
            <span className="text-xs text-slate-300 font-normal">Udyam Setu</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChatbot}
              className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded text-xs font-semibold"
            >
              AI Help
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-200"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-1 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition text-left ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
