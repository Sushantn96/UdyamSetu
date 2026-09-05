import React, { useState } from 'react';
import { X, Globe, Check, Filter, Search, Sparkles } from 'lucide-react';
import { Language } from '../types';

export interface LanguageOption {
  code: Language;
  nameEn: string;
  nameNative: string;
  regionCategory: 'all_india' | 'southern' | 'gujarati' | 'regional';
  regionLabel: string;
  statesCovered: string;
  isFullyTranslated?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // All India / Central & Major
  {
    code: 'en',
    nameEn: 'English',
    nameNative: 'English',
    regionCategory: 'all_india',
    regionLabel: 'All India Official',
    statesCovered: 'Pan-India, Central Secretariat',
    isFullyTranslated: true
  },
  {
    code: 'hi',
    nameEn: 'Hindi',
    nameNative: 'हिन्दी',
    regionCategory: 'all_india',
    regionLabel: 'All India / Central',
    statesCovered: 'UP, MP, Bihar, Rajasthan, Haryana, Delhi',
    isFullyTranslated: true
  },
  {
    code: 'mr',
    nameEn: 'Marathi',
    nameNative: 'मराठी',
    regionCategory: 'all_india',
    regionLabel: 'All India / West',
    statesCovered: 'Maharashtra, Goa',
    isFullyTranslated: false
  },
  {
    code: 'bn',
    nameEn: 'Bengali',
    nameNative: 'বাংলা',
    regionCategory: 'all_india',
    regionLabel: 'All India / East',
    statesCovered: 'West Bengal, Tripura, Assam',
    isFullyTranslated: false
  },
  {
    code: 'pa',
    nameEn: 'Punjabi',
    nameNative: 'ਪੰਜਾਬੀ',
    regionCategory: 'all_india',
    regionLabel: 'All India / North',
    statesCovered: 'Punjab, Chandigarh, Haryana',
    isFullyTranslated: false
  },
  {
    code: 'or',
    nameEn: 'Odia',
    nameNative: 'ଓଡ଼ିଆ',
    regionCategory: 'all_india',
    regionLabel: 'All India / East',
    statesCovered: 'Odisha',
    isFullyTranslated: false
  },

  // Southern Languages
  {
    code: 'ta',
    nameEn: 'Tamil',
    nameNative: 'தமிழ்',
    regionCategory: 'southern',
    regionLabel: 'Southern India',
    statesCovered: 'Tamil Nadu, Puducherry',
    isFullyTranslated: false
  },
  {
    code: 'te',
    nameEn: 'Telugu',
    nameNative: 'తెలుగు',
    regionCategory: 'southern',
    regionLabel: 'Southern India',
    statesCovered: 'Andhra Pradesh, Telangana',
    isFullyTranslated: false
  },
  {
    code: 'kn',
    nameEn: 'Kannada',
    nameNative: 'ಕನ್ನಡ',
    regionCategory: 'southern',
    regionLabel: 'Southern India',
    statesCovered: 'Karnataka',
    isFullyTranslated: false
  },
  {
    code: 'ml',
    nameEn: 'Malayalam',
    nameNative: 'മലയാളം',
    regionCategory: 'southern',
    regionLabel: 'Southern India',
    statesCovered: 'Kerala, Lakshadweep',
    isFullyTranslated: false
  },

  // Western / Gujarati
  {
    code: 'gu',
    nameEn: 'Gujarati',
    nameNative: 'ગુજરાતી',
    regionCategory: 'gujarati',
    regionLabel: 'Western / Gujarat',
    statesCovered: 'Gujarat, Daman & Diu, Dadra & Nagar Haveli',
    isFullyTranslated: false
  }
];

interface LanguageFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageFilterModal: React.FC<LanguageFilterModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'all_india' | 'southern' | 'gujarati'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ? true : item.regionCategory === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameNative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.statesCovered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLanguageClick = (lang: LanguageOption) => {
    onSelectLanguage(lang.code);
    setToastMessage(
      `Language filter set to ${lang.nameNative} (${lang.nameEn}). Regional filter active.`
    );
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      id="language-filter-modal"
    >
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Select Regional Language (भाषा फ़िल्टर)
                </h3>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  11+ Official Languages
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Filter by All-India, Southern (दाक्षिणात्य), or Gujarati (ગુજરાતી) regional languages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
            aria-label="Close language modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5" id="language-category-tabs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Languages (11)
            </button>
            <button
              onClick={() => setActiveCategory('all_india')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeCategory === 'all_india'
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>All India (अखिल भारतीय)</span>
              <span className="text-[10px] opacity-75">6</span>
            </button>
            <button
              onClick={() => setActiveCategory('southern')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeCategory === 'southern'
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Southern (दाक्षिणात्य)</span>
              <span className="text-[10px] opacity-75">4</span>
            </button>
            <button
              onClick={() => setActiveCategory('gujarati')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
                activeCategory === 'gujarati'
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Gujarati (ગુજરાતી)</span>
              <span className="text-[10px] opacity-75">1</span>
            </button>
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language by name, script or state (e.g. Gujarati, Tamil, Telugu, Hindi)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-hidden text-slate-900 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50 space-y-2">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageClick(lang)}
                  className={`flex items-start justify-between p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 font-sans">
                        {lang.nameNative}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({lang.nameEn})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {lang.regionLabel}
                      </span>
                      {lang.isFullyTranslated && (
                        <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Active UI
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">
                      {lang.statesCovered}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No languages match your search &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              All 11 constitutional schedule languages supported in Udyam Setu advisory database.
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-800 hover:text-slate-950 px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
