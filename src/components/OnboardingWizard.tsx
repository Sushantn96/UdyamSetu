import React, { useState, useMemo } from 'react';
import { 
  User, MapPin, IndianRupee, Briefcase, CheckCircle, ArrowRight, ArrowLeft, 
  Search, Sparkles, Navigation, Lock, ShieldAlert, Store, Milk, Scissors, 
  Utensils, Palette, Egg, Sprout, Wrench, Flame
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { INDIAN_GEO_DATA, findLocationByCoords } from '../data/geoData';
import { BUSINESS_CATEGORIES } from '../data/categoriesData';
import { formatCurrencyINR } from '../utils/financeCalculator';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Milk,
  Store,
  Scissors,
  Utensils,
  Palette,
  Egg,
  Sprout,
  Wrench,
  Flame
};

interface OnboardingWizardProps {
  initialProfile: UserProfile;
  language: Language;
  onComplete: (profile: UserProfile) => void;
  isLoading: boolean;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  language,
  onComplete,
  isLoading
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [geoLocating, setGeoLocating] = useState<boolean>(false);
  const [privacyAgreed, setPrivacyAgreed] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>('');

  // Cascading geo lists based on selected state, district, block
  const availableDistricts = useMemo(() => {
    const s = INDIAN_GEO_DATA.find((x) => x.state === profile.location.state);
    return s ? s.districts : [];
  }, [profile.location.state]);

  const availableBlocks = useMemo(() => {
    const d = availableDistricts.find((x) => x.name === profile.location.district);
    return d ? d.blocks : [];
  }, [availableDistricts, profile.location.district]);

  const availablePanchayats = useMemo(() => {
    const b = availableBlocks.find((x) => x.name === profile.location.block);
    return b ? b.panchayats : [];
  }, [availableBlocks, profile.location.block]);

  // Live client-side financial preview calculation
  const liveProjectCost = Math.round(profile.marginCapital / 0.10);
  const liveMaxLoan = Math.round(liveProjectCost * 0.90);
  const matchedSchemeName =
    liveProjectCost <= 140000
      ? 'Micro Finance Scheme (6.5% p.a., 3-Yr Tenure)'
      : 'General Term Loan Scheme (8.0% p.a., 7-Yr Tenure)';

  // Geolocation handler
  const handleAutoDetectLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setValidationError(language === 'hi' ? 'आपके ब्राउज़र में स्थान ट्रैकिंग समर्थित नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocating(false);
        const resolved = findLocationByCoords(pos.coords.latitude, pos.coords.longitude);
        setProfile((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            state: resolved.state,
            district: resolved.district,
            block: resolved.block,
            panchayat: resolved.panchayat,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        }));
      },
      (err) => {
        setGeoLocating(false);
        console.warn('Geolocation warning, selecting primary district:', err);
        // Fallback to primary demonstration district
        setProfile((prev) => ({
          ...prev,
          location: {
            state: 'Uttar Pradesh',
            district: 'Varanasi',
            block: 'Sevapuri',
            panchayat: 'Adampur'
          }
        }));
      },
      { timeout: 8000 }
    );
  };

  // Step Validation
  const validateAndNext = () => {
    setValidationError('');
    if (step === 1) {
      if (!profile.name.trim()) {
        setValidationError(language === 'hi' ? 'कृपया आवेदक का पूरा नाम दर्ज करें।' : 'Please enter applicant full name.');
        return;
      }
      if (!profile.mobile || profile.mobile.length < 10) {
        setValidationError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!privacyAgreed) {
        setValidationError(language === 'hi' ? 'कृपया आधार व डेटा गोपनीयता सहमति बॉक्स को चुनें।' : 'Please consent to the Aadhaar & privacy data notice.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (profile.marginCapital < 2000) {
        setValidationError(language === 'hi' ? 'न्यूनतम स्वयं का अंशदान ₹2,000 होना चाहिए।' : 'Minimum available margin capital should be at least ₹2,000.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!profile.businessCategory) {
        setValidationError(language === 'hi' ? 'कृपया कोई एक व्यवसाय श्रेणी चुनें।' : 'Please select a business category.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      onComplete(profile);
    }
  };

  const filteredCategories = BUSINESS_CATEGORIES.filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.nameHindi.includes(categorySearch) ||
      c.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden my-6">
      {/* Step Progress Header */}
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              {language === 'hi' ? 'मॉड्यूल 0: प्रारंभिक पंजीकरण' : 'Module 0: Enterprise Onboarding Wizard'}
            </span>
            <h2 className="text-lg font-bold text-white">
              {step === 1 && (language === 'hi' ? 'चरण 1: पहचान एवं ग्राम पंचायत स्थान' : 'Step 1: Identity & Location')}
              {step === 2 && (language === 'hi' ? 'चरण 2: वित्तीय अंशदान व अनुमान' : 'Step 2: Available Margin Capital')}
              {step === 3 && (language === 'hi' ? 'चरण 3: व्यावसायिक श्रेणी चयन' : 'Step 3: Business Category & Idea')}
              {step === 4 && (language === 'hi' ? 'चरण 4: समीक्षा एवं एआई विश्लेषण प्रारंभ' : 'Step 4: Review & AI Feasibility Trigger')}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/10 px-3 py-1 rounded-md border border-white/15">
            <span>{language === 'hi' ? 'प्रगति' : 'Progress'}:</span>
            <span className="text-amber-400">{step} / 4</span>
          </div>
        </div>

        {/* Visual Progress Steps Bar */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { id: 1, label: language === 'hi' ? 'स्थान' : 'Location', icon: User },
            { id: 2, label: language === 'hi' ? 'पूंजी' : 'Capital', icon: IndianRupee },
            { id: 3, label: language === 'hi' ? 'श्रेणी' : 'Category', icon: Briefcase },
            { id: 4, label: language === 'hi' ? 'समीक्षा' : 'Review', icon: Sparkles }
          ].map((s) => {
            const Icon = s.icon;
            const isPassed = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white scale-105'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {isPassed ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] mt-1 font-medium hidden sm:block ${isCurrent ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Error Banner */}
      {validationError && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3 mx-6 mt-4 text-xs text-red-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="p-6">
        {/* STEP 1: Identity & Location */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'hi' ? 'आवेदक का पूरा नाम' : 'Full Name of Applicant'} *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Rameshwar Prasad"
                  className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                  id="applicant-name-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (OTP हेतु)' : 'Mobile Number (for OTP verification)'} *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2 text-stone-500 text-sm font-medium">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={profile.mobile}
                      onChange={(e) => setProfile({ ...profile, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-3 py-2 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                      id="applicant-mobile-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      setOtpVerified(false);
                    }}
                    className="px-3 py-2 bg-stone-100 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-200"
                  >
                    {otpVerified ? 'Verified ✓' : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
              </div>
            </div>

            {/* Mock OTP input row */}
            {otpSent && !otpVerified && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-950">Mock OTP (Enter 1234):</span>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => {
                        setOtpInput(e.target.value);
                        setOtpError('');
                      }}
                      placeholder="1234"
                      className="w-20 px-2 py-1 border border-stone-300 rounded text-center font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (otpInput === '1234' || otpInput.length === 4) {
                        setOtpVerified(true);
                        setOtpError('');
                      } else {
                        setOtpError(language === 'hi' ? 'कृपया परीक्षण हेतु 1234 दर्ज करें।' : 'Please enter 1234 for mock verification.');
                      }
                    }}
                    className="bg-emerald-600 text-white px-3 py-1 rounded font-bold hover:bg-emerald-700 transition"
                  >
                    Verify
                  </button>
                </div>
                {otpError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{otpError}</p>
                )}
              </div>
            )}

            {/* Social Category and Masked Aadhaar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'hi' ? 'सामाजिक श्रेणी (MoSJE योजना पात्रता)' : 'Social Category (Eligibility Target)'}
                </label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-slate-800 focus:outline-hidden bg-white"
                  id="applicant-category-select"
                >
                  <option value="OBC">Other Backward Classes (OBC - NBCFDC)</option>
                  <option value="SC">Scheduled Castes (SC - NSFDC)</option>
                  <option value="SafaiKaramchari">Safai Karamcharis & Manual Scavengers (NSKFDC)</option>
                  <option value="DNT">De-notified, Nomadic and Semi-Nomadic Tribes (DNT)</option>
                  <option value="EBC">Economically Backward Classes (EBC)</option>
                  <option value="General">General / Women Entrepreneur</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {language === 'hi' ? 'आधार से लिंक पहचान (Masked ID)' : 'Aadhaar-Linked ID (Masked / Mock)'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={profile.aadhaarMasked}
                    onChange={(e) => setProfile({ ...profile, aadhaarMasked: e.target.value })}
                    placeholder="XXXX-XXXX-4819"
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded text-sm font-mono focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                    id="applicant-aadhaar-input"
                  />
                </div>
                <span className="text-[10px] text-stone-500">
                  {language === 'hi' ? 'गोपनीयता हेतु केवल अंतिम 4 अंक ही सुरक्षित रखे जाते हैं।' : 'For mock compliance, only the masked token is stored.'}
                </span>
              </div>
            </div>

            {/* Cascading Geo Dropdowns with Auto-Detect Button */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>{language === 'hi' ? 'स्थान निर्धारण (राज्य → ज़िला → ब्लॉक → ग्राम पंचायत)' : 'Administrative Geo Hierarchy'}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={geoLocating}
                  className="flex items-center gap-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-md transition shadow-2xs"
                  id="geo-autodetect-btn"
                >
                  <Navigation className={`w-3.5 h-3.5 text-slate-600 ${geoLocating ? 'animate-spin' : ''}`} />
                  <span>{geoLocating ? 'Detecting GPS...' : language === 'hi' ? 'मेरा स्थान स्वतः पहचानें (GPS)' : 'Auto-detect My Location (GPS)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* State */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-0.5">
                    {language === 'hi' ? 'राज्य' : 'State'}
                  </label>
                  <select
                    value={profile.location.state}
                    onChange={(e) => {
                      const newState = e.target.value;
                      const sObj = INDIAN_GEO_DATA.find((x) => x.state === newState);
                      const defDist = sObj?.districts[0]?.name || '';
                      const defBlock = sObj?.districts[0]?.blocks[0]?.name || '';
                      const defPanchayat = sObj?.districts[0]?.blocks[0]?.panchayats[0]?.name || '';
                      setProfile({
                        ...profile,
                        location: {
                          state: newState,
                          district: defDist,
                          block: defBlock,
                          panchayat: defPanchayat
                        }
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-slate-800"
                    id="geo-state-select"
                  >
                    {INDIAN_GEO_DATA.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-0.5">
                    {language === 'hi' ? 'ज़िला' : 'District'}
                  </label>
                  <select
                    value={profile.location.district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      const dObj = availableDistricts.find((x) => x.name === newDist);
                      const defBlock = dObj?.blocks[0]?.name || '';
                      const defPanchayat = dObj?.blocks[0]?.panchayats[0]?.name || '';
                      setProfile({
                        ...profile,
                        location: {
                          ...profile.location,
                          district: newDist,
                          block: defBlock,
                          panchayat: defPanchayat
                        }
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-slate-800"
                    id="geo-district-select"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Block */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-0.5">
                    {language === 'hi' ? 'ब्लॉक / तहसील' : 'Block / Tehsil'}
                  </label>
                  <select
                    value={profile.location.block}
                    onChange={(e) => {
                      const newBlock = e.target.value;
                      const bObj = availableBlocks.find((x) => x.name === newBlock);
                      const defPanchayat = bObj?.panchayats[0]?.name || '';
                      setProfile({
                        ...profile,
                        location: {
                          ...profile.location,
                          block: newBlock,
                          panchayat: defPanchayat
                        }
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-slate-800"
                    id="geo-block-select"
                  >
                    {availableBlocks.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} (Pop: {(b.population / 1000).toFixed(0)}k)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gram Panchayat / Village */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 uppercase mb-0.5">
                    {language === 'hi' ? 'ग्राम पंचायत / गांव' : 'Gram Panchayat / Village'}
                  </label>
                  <select
                    value={profile.location.panchayat}
                    onChange={(e) => {
                      setProfile({
                        ...profile,
                        location: {
                          ...profile.location,
                          panchayat: e.target.value
                        }
                      });
                    }}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded text-xs bg-white font-medium focus:ring-1 focus:ring-slate-800"
                    id="geo-panchayat-select"
                  >
                    {availablePanchayats.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} (Pop: {p.population})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Statutory Privacy & Consent Checkbox */}
            <div className="bg-stone-50 border border-stone-200 rounded p-3 text-xs text-stone-600 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="privacy-consent"
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-slate-800 focus:ring-slate-800"
              />
              <label htmlFor="privacy-consent" className="cursor-pointer">
                <span className="font-semibold text-stone-800">
                  {language === 'hi' ? 'डेटा गोपनीयता एवं आधार सत्यापन सहमति:' : 'Data Privacy & Aadhaar Consent Notice:'}
                </span>{' '}
                {language === 'hi'
                  ? 'मैं प्रमाणित करता/करती हूँ कि दी गई जानकारी MoSJE रियायती ऋण व्यवहार्यता एवं वित्तीय विश्लेषण हेतु स्वेच्छा से प्रदान की गई है।'
                  : 'I hereby consent to the processing of this demographic and financial data solely for the purpose of government concessional loan eligibility assessment under MoSJE guidelines.'}
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: Financial Input with Live Preview */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-800 uppercase flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'उपलब्ध स्वयं का अंशदान (Available Margin Capital)' : 'Available Margin Capital (Self Contribution)'}</span>
                </label>
                <span className="text-xl font-bold text-slate-900 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-2xs">
                  {formatCurrencyINR(profile.marginCapital)}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                {language === 'hi'
                  ? 'सरकारी योजनाओं के अनुसार आपको कुल परियोजना लागत का केवल 10% स्वयं वहन करना होता है। शेष 90% राशि रियायती ऋण के रूप में प्राप्त हो सकती है।'
                  : 'Under MoSJE concessional schemes, you contribute 10% as promoter margin, while 90% is financed via low-interest loans.'}
              </p>

              {/* Range Slider */}
              <input
                type="range"
                min={5000}
                max={200000}
                step={2000}
                value={profile.marginCapital}
                onChange={(e) => setProfile({ ...profile, marginCapital: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                id="margin-capital-slider"
              />

              <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1">
                <span>₹5,000 (Micro)</span>
                <span>₹50,000</span>
                <span>₹1,00,000</span>
                <span>₹2,00,000+ (Term Loan)</span>
              </div>

              {/* Direct numeric input */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-medium text-slate-700">
                  {language === 'hi' ? 'सीधा मान दर्ज करें:' : 'Or enter exact amount:'}
                </span>
                <div className="relative w-48">
                  <span className="absolute left-2.5 top-2 text-slate-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min={2000}
                    max={1000000}
                    step={1000}
                    value={profile.marginCapital}
                    onChange={(e) => setProfile({ ...profile, marginCapital: Math.max(0, Number(e.target.value)) })}
                    className="w-full pl-6 pr-2 py-1.5 border border-slate-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-slate-800"
                    id="margin-capital-numeric-input"
                  />
                </div>
              </div>
            </div>

            {/* Helper Text Live Preview Banner */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'तत्काल वित्तीय योग्यता अनुमान (Live Preview)' : 'Instant Financial Qualification Preview'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-md p-3 border border-emerald-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block uppercase">
                    {language === 'hi' ? 'कुल परियोजना लागत (10x)' : 'Total Project Cost (10x)'}
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {formatCurrencyINR(liveProjectCost)}
                  </span>
                </div>

                <div className="bg-white rounded-md p-3 border border-emerald-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block uppercase">
                    {language === 'hi' ? 'अधिकतम ऋण पात्रता (90%)' : 'Max Loan Eligibility (90%)'}
                  </span>
                  <span className="text-lg font-bold text-emerald-700">
                    {formatCurrencyINR(liveMaxLoan)}
                  </span>
                </div>

                <div className="bg-white rounded-md p-3 border border-emerald-200/80 shadow-2xs">
                  <span className="text-[11px] text-slate-500 font-medium block uppercase">
                    {language === 'hi' ? 'स्वतः चयनित योजना' : 'Matched Scheme'}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 block mt-1">
                    {liveProjectCost <= 140000 ? 'Micro Finance Scheme' : 'Term Loan Scheme'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-emerald-950 font-medium leading-relaxed bg-white/70 p-2.5 rounded-md border border-emerald-200">
                {language === 'hi'
                  ? `आपके ₹${profile.marginCapital.toLocaleString('en-IN')} के अंशदान से आप ₹${liveProjectCost.toLocaleString('en-IN')} तक की परियोजना एवं ₹${liveMaxLoan.toLocaleString('en-IN')} तक के रियायती ऋण के पात्र हैं (${matchedSchemeName})।`
                  : `Your available capital of ₹${profile.marginCapital.toLocaleString('en-IN')} typically qualifies you for a Project Cost of ₹${liveProjectCost.toLocaleString('en-IN')} and a Concessional Loan of ₹${liveMaxLoan.toLocaleString('en-IN')} under the ${matchedSchemeName}.`}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Business Category & NLP Idea */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder={language === 'hi' ? 'श्रेणी खोजें (उदा: डेयरी, किराना, सिलाई, कुक्कुट, हस्तशिल्प)...' : 'Search business category (e.g. Dairy, Kirana, Weaving, Food, Poultry)...'}
                className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                id="category-search-input"
              />
            </div>

            {/* Grid of Business Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredCategories.map((cat) => {
                const isSelected = profile.businessCategory === cat.id;
                const IconComponent = CATEGORY_ICONS[cat.iconName] || Store;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, businessCategory: cat.id })}
                    className={`text-left p-3 rounded-lg border transition-all relative ${
                      isSelected
                        ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800 shadow-2xs'
                        : 'border-stone-200 hover:border-slate-400 bg-white'
                    }`}
                    id={`category-card-${cat.id}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-md shrink-0 ${isSelected ? 'bg-slate-900 text-white' : 'bg-stone-100 text-stone-700'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 leading-tight">
                          {language === 'hi' ? cat.nameHindi : cat.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                          {language === 'hi' ? cat.descriptionHindi : cat.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold text-stone-600">
                          <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                            {cat.demandFactor} Demand
                          </span>
                          <span>Min: ₹{(cat.typicalMinProjectCost / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Free-text Idea Description for AI NLP */}
            <div className="border-t border-stone-200 pt-4">
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                {language === 'hi'
                  ? 'अपने व्यावसायिक विचार का विवरण (वैकल्पिक - एआई द्वारा विश्लेषण)'
                  : 'Describe your idea / custom setup (Optional - for AI NLP contextualization)'}
              </label>
              <textarea
                rows={3}
                value={profile.customIdeaDescription || ''}
                onChange={(e) => setProfile({ ...profile, customIdeaDescription: e.target.value })}
                placeholder={
                  language === 'hi'
                    ? 'उदा. मैं 2 दुधारू भैंसों के साथ दूध संकलन केंद्र खोलना चाहता हूँ और पास की डेयरी को आपूर्ति करना चाहता हूँ...'
                    : 'e.g. Planning a small dairy unit with 2 milch buffaloes, supply to local cooperative, and cold storage tank...'
                }
                className="w-full p-3 border border-stone-300 rounded text-xs focus:ring-2 focus:ring-slate-800 focus:outline-hidden"
                id="custom-idea-textarea"
              />
              <span className="text-[10px] text-stone-500">
                {language === 'hi'
                  ? 'हमारा एआई इंजन इस विवरण को स्थानीय मंडी डेटा के साथ जोड़कर रिपोर्ट तैयार करेगा।'
                  : 'The AI engine uses this description to personalize SWOT, risk identification, and pricing.'}
              </span>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="bg-stone-50 border border-stone-300 rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-stone-200 pb-2">
                {language === 'hi' ? 'आवेदन सारांश समीक्षा' : 'Application Summary Review'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'आवेदक का नाम:' : 'Applicant Name:'}</span>
                  <span className="font-bold text-stone-800">{profile.name}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'मोबाइल नंबर:' : 'Mobile Number:'}</span>
                  <span className="font-bold text-stone-800">+91 {profile.mobile}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'सामाजिक श्रेणी:' : 'Social Category:'}</span>
                  <span className="font-bold text-stone-800">{profile.category}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'आधार कार्ड:' : 'Masked Aadhaar:'}</span>
                  <span className="font-mono font-semibold text-stone-800">{profile.aadhaarMasked}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-500 block">{language === 'hi' ? 'स्थान विवरण:' : 'Location:'}</span>
                  <span className="font-semibold text-stone-800">
                    Gram Panchayat {profile.location.panchayat}, Block {profile.location.block}, District {profile.location.district}, {profile.location.state}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'स्वयं का अंशदान:' : 'Margin Capital:'}</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatCurrencyINR(profile.marginCapital)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">{language === 'hi' ? 'चयनित व्यवसाय श्रेणी:' : 'Business Category:'}</span>
                  <span className="font-bold text-emerald-800 capitalize">
                    {profile.businessCategory.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {profile.customIdeaDescription && (
                <div className="mt-2 pt-2 border-t border-stone-200 text-xs">
                  <span className="text-stone-500 block font-semibold">{language === 'hi' ? 'विचार विवरण:' : 'Idea Note:'}</span>
                  <p className="text-stone-700 italic">"{profile.customIdeaDescription}"</p>
                </div>
              )}
            </div>

            {/* AI Grounding Callout */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-4 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-1">
                  {language === 'hi' ? 'एआई विश्लेषण इंजन (Module 1 - Feasibility)' : 'AI Grounded Feasibility Engine Ready'}
                </span>
                <p>
                  {language === 'hi'
                    ? 'सबमिट करने पर सिस्टम ब्लॉक जनसंख्या, मंडी spot prices, एवं प्रतिस्पर्धी घनत्व को AI मॉडल में प्रोसेस कर व्यवहार्यता रिपोर्ट तैयार करेगा।'
                    : 'Submitting will retrieve local Census population figures, Agmarknet mandi prices, and local competitor density to synthesize your feasibility score, SWOT, and unit economics.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="bg-slate-50/80 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setValidationError('');
              setStep(step - 1);
            }}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            id="wizard-prev-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'पिछला' : 'Back'}</span>
          </button>
        ) : (
          <div></div>
        )}

        <button
          type="button"
          onClick={validateAndNext}
          disabled={isLoading}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-md text-xs font-semibold transition shadow-xs disabled:opacity-50"
          id="wizard-next-btn"
        >
          {isLoading ? (
            <span>{language === 'hi' ? 'विश्लेषण जारी...' : 'Analyzing Local Market...'}</span>
          ) : step === 4 ? (
            <>
              <span>{language === 'hi' ? 'व्यवहार्यता रिपोर्ट जनरेट करें' : 'Generate Feasibility Report'}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </>
          ) : (
            <>
              <span>{language === 'hi' ? 'अगला' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
