import React, { useState } from 'react';
import { Volume2, Eye, Globe, Filter } from 'lucide-react';
import { Language } from '../types';
import { LanguageFilterModal, SUPPORTED_LANGUAGES } from './LanguageFilterModal';

interface TopUtilityBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  fontSize: 'sm' | 'md' | 'lg';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
  onScreenReaderNotice: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  language,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastToggle,
  onScreenReaderNotice
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  return (
    <div
      className={`w-full text-xs border-b transition-colors ${
        highContrast
          ? 'bg-black text-amber-300 border-amber-500'
          : 'bg-slate-100/90 text-slate-600 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left utility: Skip to main content & screen reader */}
        <div className="flex items-center gap-3">
          <a
            href="#main-content"
            className="px-2 py-0.5 rounded font-medium underline focus:ring-2 focus:ring-slate-900 focus:outline-hidden hover:text-slate-900"
            id="skip-to-content"
          >
            {language === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
          </a>
          <span className="text-slate-300">|</span>
          <button
            onClick={onScreenReaderNotice}
            className="flex items-center gap-1.5 hover:text-slate-900 focus:outline-hidden focus:underline"
            title="Screen Reader Access"
            aria-label="Screen Reader Access"
            id="screen-reader-btn"
          >
            <Volume2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'स्क्रीन रीडर' : 'Screen Reader Access'}
            </span>
          </button>
        </div>

        {/* Right utility: Font size, High contrast, Language selector & Filter */}
        <div className="flex items-center gap-3">
          {/* Font Size Adjuster */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1">
              {language === 'hi' ? 'आकार' : 'Text'}
            </span>
            <button
              onClick={() => onFontSizeChange('sm')}
              className={`px-1.5 py-0.2 rounded font-semibold text-xs ${fontSize === 'sm' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              aria-label="Decrease Font Size"
              id="font-size-sm"
            >
              A-
            </button>
            <button
              onClick={() => onFontSizeChange('md')}
              className={`px-1.5 py-0.2 rounded font-semibold text-xs ${fontSize === 'md' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              aria-label="Normal Font Size"
              id="font-size-md"
            >
              A
            </button>
            <button
              onClick={() => onFontSizeChange('lg')}
              className={`px-1.5 py-0.2 rounded font-semibold text-xs ${fontSize === 'lg' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              aria-label="Increase Font Size"
              id="font-size-lg"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onHighContrastToggle}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md border ${
              highContrast
                ? 'bg-amber-400 text-black border-amber-500 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
            }`}
            aria-label="Toggle High Contrast"
            id="contrast-toggle-btn"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">
              {highContrast ? 'Standard' : language === 'hi' ? 'हाई कॉन्ट्रास्ट' : 'High Contrast'}
            </span>
          </button>

          <span className="text-slate-300">|</span>

          {/* Language Switcher with Categorized Groups & Filter Button */}
          <div className="flex items-center gap-1.5" id="language-switcher-wrapper">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-slate-900 focus:outline-hidden shadow-2xs"
              aria-label="Select Language"
              id="language-select"
            >
              <optgroup label="All India (अखिल भारतीय)">
                <option value="en">English (Pan-India)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
              </optgroup>
              <optgroup label="Southern Languages (दाक्षिणात्य)">
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
              </optgroup>
              <optgroup label="Western (पश्चिम)">
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </optgroup>
            </select>

            {/* Language Filter Popover / Modal Trigger Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md px-2 py-0.5 text-xs font-semibold shadow-2xs transition"
              title="Filter and browse all Indian languages"
              aria-label="Open Language Filter"
              id="language-filter-trigger"
            >
              <Filter className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'भाषा फ़िल्टर' : 'Filter'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Language Filter Modal */}
      <LanguageFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedLanguage={language}
        onSelectLanguage={onLanguageChange}
      />
    </div>
  );
};
