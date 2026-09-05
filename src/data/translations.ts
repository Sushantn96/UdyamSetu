export const TRANSLATIONS: Record<string, Record<string, string>> = {
  portalTitle: {
    en: "Udyam Setu",
    hi: "उद्यम सेतु"
  },
  portalSubtitle: {
    en: "AI-Driven Hyper-Local Business Advisory & Financial Structuring Assistant",
    hi: "ग्रामीण सूक्ष्म उद्यमियों हेतु कृत्रिम बुद्धिमत्ता आधारित स्थानीय व्यापार सलाह व वित्तीय मार्गदर्शन"
  },
  ministryWordmark: {
    en: "Ministry of Social Justice and Empowerment | Government of India",
    hi: "सामाजिक न्याय और अधिकारिता मंत्रालय | भारत सरकार"
  },
  digitalIndiaBadge: {
    en: "Digital India",
    hi: "डिजिटल भारत"
  },
  skillIndiaBadge: {
    en: "Skill India",
    hi: "कौशल भारत"
  },
  skipToContent: {
    en: "Skip to main content",
    hi: "मुख्य सामग्री पर जाएं"
  },
  screenReader: {
    en: "Screen Reader Access",
    hi: "स्क्रीन रीडर सहायता"
  },
  fontSize: {
    en: "Text Size",
    hi: "फ़ॉन्ट आकार"
  },
  contrast: {
    en: "High Contrast",
    hi: "हाई कॉन्ट्रास्ट"
  },
  navHome: {
    en: "Home",
    hi: "होम"
  },
  navAboutScheme: {
    en: "About the Schemes",
    hi: "योजनाओं के बारे में"
  },
  navFeasibility: {
    en: "Feasibility Report",
    hi: "व्यवहार्यता रिपोर्ट"
  },
  navCalculator: {
    en: "Financial Calculator",
    hi: "वित्तीय कैलकुलेटर"
  },
  navApplications: {
    en: "My Applications",
    hi: "मेरे आवेदन"
  },
  navChatbot: {
    en: "AI Sahayak",
    hi: "एआई सहायक"
  },
  navContact: {
    en: "Contact & Helplines",
    hi: "संपर्क एवं हेल्पलाइन"
  },
  step1Title: {
    en: "Identity & Location",
    hi: "पहचान एवं स्थान"
  },
  step2Title: {
    en: "Financial Margin",
    hi: "स्वयं का अंशदान"
  },
  step3Title: {
    en: "Business Category",
    hi: "व्यवसाय श्रेणी"
  },
  step4Title: {
    en: "Review & AI Analysis",
    hi: "पुष्टि एवं एआई विश्लेषण"
  },
  marginCapitalLabel: {
    en: "Available Margin Capital (₹)",
    hi: "उपलब्ध स्वयं का अंशदान (₹)"
  },
  autoLocationBtn: {
    en: "Auto-detect My Location (GPS)",
    hi: "मेरा स्थान स्वतः पहचानें (GPS)"
  },
  feasibilityScoreLabel: {
    en: "Hyper-Local Feasibility Score",
    hi: "स्थानीय व्यवहार्यता स्कोर"
  },
  marketReachTitle: {
    en: "Local Market Reach (5–10 km)",
    hi: "स्थानीय बाज़ार पहुंच (5–10 किमी)"
  },
  opportunityTitle: {
    en: "Underserved Local Opportunities",
    hi: "स्थानीय अप्रयुक्त व्यावसायिक अवसर"
  },
  swotTitle: {
    en: "SWOT Analysis Matrix",
    hi: "स्वॉट (SWOT) विश्लेषण"
  },
  threatsTitle: {
    en: "Risk & Threat Identification",
    hi: "जोखिम एवं खतरे की पहचान"
  },
  competitorTitle: {
    en: "Competitor Mapping & Density",
    hi: "प्रतिस्पर्धी मैपिंग एवं घनत्व"
  },
  pricingTitle: {
    en: "Product Value & Unit Economics",
    hi: "उत्पाद मूल्य एवं यूनिट इकोनॉमिक्स"
  },
  regenerateWithAi: {
    en: "Regenerate with AI",
    hi: "एआई द्वारा पुनः विश्लेषण करें"
  },
  downloadBusinessPlan: {
    en: "Download Formal Business Plan (PDF)",
    hi: "व्यावसायिक परियोजना रिपोर्ट डाउनलोड करें (PDF)"
  },
  shareReport: {
    en: "Share via WhatsApp / Email",
    hi: "व्हाट्सएप / ईमेल पर साझा करें"
  },
  officialDisclaimer: {
    en: "This advisory portal is developed for the Ministry of Social Justice & Empowerment (MoSJE) implementing NBCFDC / NSFDC concessional credit schemes. Final loan sanctioning is subject to verification by State Channelising Agencies (SCAs) and designated partner banks.",
    hi: "यह सलाह पोर्टल सामाजिक न्याय और अधिकारिता मंत्रालय के अधीन NBCFDC / NSFDC रियायती ऋण योजनाओं हेतु विकसित है। ऋण की अंतिम स्वीकृति राज्य चैनलाइजिंग एजेंसी (SCA) एवं बैंक शाखा सत्यापन के अधीन है।"
  },
  contentOwned: {
    en: "Content Owned, Maintained and Updated by Ministry of Social Justice and Empowerment, Government of India.",
    hi: "सामग्री का स्वामित्व, रख-रखाव एवं अद्यतन सामाजिक न्याय और अधिकारिता मंत्रालय, भारत सरकार द्वारा।"
  }
};

export function getTranslation(key: string, lang: 'en' | 'hi' = 'en'): string {
  if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
    return TRANSLATIONS[key][lang];
  }
  if (TRANSLATIONS[key] && TRANSLATIONS[key]['en']) {
    return TRANSLATIONS[key]['en'];
  }
  return key;
}
