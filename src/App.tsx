import React, { useState, useEffect } from 'react';
import { TopUtilityBar } from './components/TopUtilityBar';
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { Breadcrumb } from './components/Breadcrumb';
import { HeroBanner } from './components/HeroBanner';
import { OnboardingWizard } from './components/OnboardingWizard';
import { FeasibilityView } from './components/FeasibilityView';
import { FinancialCalculatorView } from './components/FinancialCalculatorView';
import { BusinessPlanReportView } from './components/BusinessPlanReportView';
import { AboutSchemeView } from './components/AboutSchemeView';
import { ContactView } from './components/ContactView';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';

import { UserProfile, FeasibilityReport, LocalMarketContext, Language } from './types';
import { Sparkles, CheckCircle2, Loader2, Database, TrendingUp, Users, BarChart3, FileText, ArrowRight } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_demo_01',
  name: 'Rameshwar Prasad',
  mobile: '9876543210',
  aadhaarMasked: 'XXXX-XXXX-4819',
  category: 'OBC',
  location: {
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    block: 'Sevapuri',
    panchayat: 'Adampur'
  },
  marginCapital: 12000,
  businessCategory: 'dairy',
  customIdeaDescription: 'Small milk collection and distribution center with 2 milch animals and chill storage container.',
  createdAt: new Date().toISOString()
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [feasibilityReport, setFeasibilityReport] = useState<FeasibilityReport | null>(null);
  const [localContext, setLocalContext] = useState<LocalMarketContext | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [isRegeneratingSection, setIsRegeneratingSection] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [showScreenReaderModal, setShowScreenReaderModal] = useState<boolean>(false);

  // Initial load: generate baseline feasibility report for default profile
  useEffect(() => {
    generateReport(DEFAULT_PROFILE, false);
  }, []);

  const generateReport = async (profileToUse: UserProfile, switchToFeasibilityTab = true) => {
    setIsLoading(true);
    setLoadingStep(
      language === 'hi'
        ? 'जनगणना 2011 विलेज डायरेक्टरी से डेटा प्राप्त किया जा रहा है...'
        : 'Accessing Census 2011 Village Registry & Local Block Directory...'
    );

    // Staged visual loading indicators
    const step1Timer = setTimeout(() => {
      setLoadingStep(
        language === 'hi'
          ? 'एगमार्कनेट (Agmarknet) से निकटतम मंडी दरों का मिलान किया जा रहा है...'
          : 'Aggregating Agmarknet Mandi Spot Prices & Transport Corridors...'
      );
    }, 1000);

    const step2Timer = setTimeout(() => {
      setLoadingStep(
        language === 'hi'
          ? 'एमएसएमई उद्यम रजिस्टर से प्रतिस्पर्धी घनत्व का मानचित्रण...'
          : 'Mapping Competitor Density from MSME Udyam Database...'
      );
    }, 2000);

    const step3Timer = setTimeout(() => {
      setLoadingStep(
        language === 'hi'
          ? 'जेमिनी (Gemini) एआई द्वारा वित्तीय व्यवहार्यता व स्वॉट विश्लेषण निर्माण...'
          : 'Synthesizing Multi-Factor Feasibility, SWOT & Unit Economics via Gemini AI...'
      );
    }, 3200);

    try {
      // 1. Save or sync user profile
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToUse)
      });

      // 2. Request feasibility report from server
      const res = await fetch('/api/feasibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToUse)
      });

      const data = await res.json();
      if (data.success && data.report) {
        setFeasibilityReport(data.report);
        setLocalContext(data.localContext);
        if (switchToFeasibilityTab) {
          setCurrentTab('feasibility');
        }
      }
    } catch (err) {
      console.error('Failed to generate feasibility report:', err);
    } finally {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsLoading(false);
    }
  };

  const handleWizardComplete = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    generateReport(newProfile, true);
  };

  const handleRegenerateSection = async (sectionKey: string) => {
    setIsRegeneratingSection(true);
    await generateReport(userProfile, false);
    setIsRegeneratingSection(false);
  };

  const handleApplyMarginCapital = (newMargin: number) => {
    setUserProfile((prev) => ({ ...prev, marginCapital: newMargin }));
  };

  // Font size class mapping
  const fontSizeClass =
    fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${fontSizeClass} ${
        highContrast
          ? 'bg-black text-amber-200'
          : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* 1. Accessible Top Utility Bar */}
      <TopUtilityBar
        language={language}
        onLanguageChange={setLanguage}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        highContrast={highContrast}
        onHighContrastToggle={() => setHighContrast(!highContrast)}
        onScreenReaderNotice={() => setShowScreenReaderModal(true)}
      />

      {/* 2. Official Ministry Header with National Emblem */}
      <Header language={language} highContrast={highContrast} />

      {/* 3. Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        highContrast={highContrast}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* 4. Breadcrumb Navigation on inner tabs */}
      <Breadcrumb
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        language={language}
      />

      {/* 5. Main Content Landmark */}
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        {/* Loading Overlay when generating AI Feasibility */}
        {isLoading && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-xl border border-slate-200 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-slate-800 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'स्थानीय बाज़ार का एआई विश्लेषण जारी...' : 'Analyzing Local Market Feasibility...'}
                </h3>
                <p className="text-xs text-slate-600 mt-2 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {loadingStep}
                </p>
              </div>

              <div className="space-y-2 text-left text-xs text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                  <span>Census 2011 Primary Abstract: Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Agmarknet Mandi Spot Price API: Normalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Competitor Density Cluster: Computed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Home (Hero Carousel + Onboarding Wizard) */}
        {currentTab === 'home' && (
          <div className="space-y-6">
            {/* Scheme Carousel Highlights */}
            <HeroBanner
              language={language}
              onStartAssessment={() => {
                const el = document.getElementById('onboarding-wizard-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenCalculator={() => setCurrentTab('calculator')}
            />

            {/* Wizard Container */}
            <div id="onboarding-wizard-section" className="px-4">
              <OnboardingWizard
                initialProfile={userProfile}
                language={language}
                onComplete={handleWizardComplete}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* TAB: About Scheme */}
        {currentTab === 'about' && (
          <AboutSchemeView
            language={language}
            onStartAssessment={() => setCurrentTab('home')}
            onOpenCalculator={() => setCurrentTab('calculator')}
          />
        )}

        {/* TAB: Feasibility Report */}
        {currentTab === 'feasibility' && (
          feasibilityReport && localContext ? (
            <FeasibilityView
              report={feasibilityReport}
              localContext={localContext}
              profile={userProfile}
              language={language}
              onRegenerateSection={handleRegenerateSection}
              isRegenerating={isRegeneratingSection || isLoading}
              onGoToCalculator={() => setCurrentTab('calculator')}
              onGoToBusinessPlan={() => setCurrentTab('report')}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-800" /> : <BarChart3 className="w-6 h-6" />}
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {isLoading
                  ? (language === 'hi' ? 'विश्लेषण प्रक्रियाधीन है...' : 'Generating Feasibility Assessment...')
                  : (language === 'hi' ? 'व्यवहार्यता रिपोर्ट अभी तैयार नहीं है' : 'Feasibility Report Not Yet Generated')}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isLoading
                  ? (language === 'hi' ? 'कृषि विज्ञान केंद्र और स्थानीय बाज़ार डेटा संकलित किया जा रहा है। कृपया प्रतीक्षा करें।' : 'Fetching local market intelligence and validating scheme eligibility. Please wait...')
                  : (language === 'hi' ? 'कृपया होम स्क्रीन पर अपनी प्रोफ़ाइल की पुष्टि करें अथवा तत्काल AI विश्लेषण प्रारंभ करें।' : 'Please review your enterprise parameters or click below to launch instant AI feasibility analysis.')}
              </p>
              {!isLoading && (
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {language === 'hi' ? 'प्रोफ़ाइल देखें' : 'Review Profile'}
                  </button>
                  <button
                    onClick={() => generateReport(userProfile, true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'hi' ? 'विश्लेषण शुरू करें' : 'Generate Feasibility'}</span>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* TAB: Financial Calculator */}
        {currentTab === 'calculator' && (
          <FinancialCalculatorView
            initialMarginCapital={userProfile.marginCapital}
            businessCategoryId={userProfile.businessCategory}
            language={language}
            onApplyMarginCapital={handleApplyMarginCapital}
          />
        )}

        {/* TAB: Business Plan (DPR) */}
        {currentTab === 'report' && (
          feasibilityReport && localContext ? (
            <BusinessPlanReportView
              report={feasibilityReport}
              profile={userProfile}
              localContext={localContext}
              language={language}
              onBackToDashboard={() => setCurrentTab('feasibility')}
            />
          ) : (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-800" /> : <FileText className="w-6 h-6" />}
              </div>
              <h2 className="text-base font-bold text-slate-900">
                {isLoading
                  ? (language === 'hi' ? 'परियोजना रिपोर्ट तैयार की जा रही है...' : 'Formulating Detailed Project Report...')
                  : (language === 'hi' ? 'विस्तृत परियोजना रिपोर्ट (DPR) उपलब्ध नहीं है' : 'Business Plan Report Not Yet Ready')}
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {isLoading
                  ? (language === 'hi' ? 'ऋण चुकौती अनुसूची और मोराटोरियम विवरण तैयार किए जा रहे हैं।' : 'Synthesizing bank-ready cash flows and amortization schedule...')
                  : (language === 'hi' ? 'विस्तृत परियोजना रिपोर्ट (DPR) बनाने के लिए पहले अपनी उद्यम प्रोफ़ाइल का विश्लेषण प्रारंभ करें।' : 'To generate a bank-ready Detailed Project Report (DPR), please initiate feasibility analysis first.')}
              </p>
              {!isLoading && (
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {language === 'hi' ? 'प्रोफ़ाइल सेटिंग्स' : 'Go to Setup'}
                  </button>
                  <button
                    onClick={() => generateReport(userProfile, true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition inline-flex items-center gap-2 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'hi' ? 'रिपोर्ट तैयार करें' : 'Generate Full DPR'}</span>
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* TAB: Contact & Helplines */}
        {currentTab === 'contact' && (
          <ContactView language={language} />
        )}
      </main>

      {/* 6. Persistent AI Sahayak Chatbot Widget */}
      <ChatbotWidget
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        userProfile={userProfile}
        feasibilityReport={feasibilityReport}
        language={language}
      />

      {/* 7. Official NIC / india.gov.in Footer */}
      <Footer language={language} highContrast={highContrast} />

      {/* Screen Reader Access Modal */}
      {showScreenReaderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Screen Reader & Accessibility Information
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              This portal adheres to the Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 AA specifications.
            </p>
            <ul className="text-xs text-slate-600 list-disc list-inside space-y-1.5">
              <li>All primary UI elements include semantic ARIA labels and unique element IDs.</li>
              <li>Use the high-contrast toggle for enhanced visibility.</li>
              <li>The AI Sahayak chatbot includes speech-to-text and voice-readout synthesis.</li>
              <li>Keyboard users can press <kbd className="bg-slate-100 border border-slate-300 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-mono">Tab</kbd> to reach the "Skip to main content" link.</li>
            </ul>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowScreenReaderModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
