import { GoogleGenAI } from "@google/genai";
import { ScrapedMarketContext } from "./scraperService";

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

export interface FeasibilityInput {
  userId: string;
  name: string;
  category: string;
  marginCapital: number;
  location: {
    state: string;
    district: string;
    block: string;
    panchayat: string;
  };
  customIdeaDescription?: string;
  localContext: ScrapedMarketContext;
}

export async function generateFeasibilityReportWithAi(input: FeasibilityInput) {
  const ai = getAiClient();

  const baseProjectCost = Math.round(input.marginCapital / 0.10);
  const maxLoan = Math.round(baseProjectCost * 0.90);

  // If Gemini API is available, invoke model
  if (ai) {
    try {
      const prompt = `
You are the Chief Enterprise Advisor for the Ministry of Social Justice and Empowerment (MoSJE), Government of India.
You are evaluating a rural micro-enterprise project proposal for a citizen in India under the National Backward Classes Finance & Development Corporation (NBCFDC) or National Scheduled Castes Finance & Development Corporation (NSFDC) concessional credit scheme.

APPLICANT DETAILS:
- Name: ${input.name}
- Category: ${input.category}
- Margin Capital (Self Contribution): ₹${input.marginCapital}
- Computed Project Cost: ₹${baseProjectCost}
- Maximum Eligible Concessional Loan: ₹${maxLoan}
- Location: Gram Panchayat ${input.location.panchayat}, Block ${input.location.block}, District ${input.location.district}, State ${input.location.state}
- Idea Description: ${input.customIdeaDescription || 'Standard rural micro-enterprise unit'}

RETRIEVED LOCAL GROUNDING DATA (Census & Agmarknet Scraped):
- Block Population: ${input.localContext.blockPopulation}
- Panchayat Population: ${input.localContext.panchayatPopulation}
- Average Rural Household Monthly Income: ₹${input.localContext.avgMonthlyHouseholdIncome}
- Nearest APMC Mandi: ${input.localContext.nearestMandiName} (${input.localContext.distanceToMandiKm} km away)
- Benchmark Market Pricing: ${input.localContext.agmarknetPriceBenchmark}
- Existing Competitors in block: ${input.localContext.existingCompetitorCount}
- Power Supply: ${input.localContext.powerSupplyDailyAvgHours} hrs/day

Generate a rigorous, locally-grounded Feasibility Analysis JSON object matching this EXACT structure:
{
  "feasibilityScore": (integer between 65 and 96),
  "verdict": "High Feasibility" | "Moderate Feasibility" | "Conditional Feasibility",
  "verdictExplanation": "(2 concise sentences explaining feasibility considering capital and local block demand)",
  "scoreBreakdown": {
    "localDemand": (integer 15-25),
    "competitionDensity": (integer 12-20),
    "capitalAdequacy": (integer 15-25),
    "seasonalRisk": (integer 8-15),
    "locationFit": (integer 10-15)
  },
  "marketReach": {
    "consumerBase5Km": (integer e.g. 18000),
    "consumerBase10Km": (integer e.g. 54000),
    "targetDemographics": "(e.g. Village households, weekly haat shoppers, nearby highway travelers)",
    "primaryDistributionChannels": ["Direct Farmgate/Shop Sales", "Supply to Gram Panchayat Haat", "Tie-up with local retailers"]
  },
  "opportunityAnalysis": [
    {
      "title": "(Short opportunity name)",
      "description": "(Specific to ${input.location.block} and ${input.category})",
      "potentialImpact": "High" | "Medium"
    },
    {
      "title": "(Second opportunity)",
      "description": "(Explanation)",
      "potentialImpact": "High" | "Medium"
    },
    {
      "title": "(Third opportunity)",
      "description": "(Explanation)",
      "potentialImpact": "Medium"
    }
  ],
  "swot": {
    "strengths": ["(Strength 1)", "(Strength 2)", "(Strength 3)"],
    "weaknesses": ["(Weakness 1)", "(Weakness 2)"],
    "opportunities": ["(Opportunity 1)", "(Opportunity 2)", "(Opportunity 3)"],
    "threats": ["(Threat 1)", "(Threat 2)"]
  },
  "threats": [
    {
      "id": "risk_1",
      "riskName": "(Specific risk name)",
      "severity": "High" | "Medium" | "Low",
      "category": "Supply Chain" | "Seasonality" | "Single-Buyer Dependency" | "Financial",
      "mitigationStrategy": "(Actionable mitigation for rural entrepreneur)"
    },
    {
      "id": "risk_2",
      "riskName": "(Specific risk name)",
      "severity": "Medium" | "Low",
      "category": "Supply Chain" | "Seasonality" | "Single-Buyer Dependency" | "Financial",
      "mitigationStrategy": "(Actionable mitigation)"
    },
    {
      "id": "risk_3",
      "riskName": "(Specific risk name)",
      "severity": "Low" | "Medium",
      "category": "Supply Chain" | "Seasonality" | "Single-Buyer Dependency" | "Financial",
      "mitigationStrategy": "(Actionable mitigation)"
    }
  ],
  "competitorMapping": {
    "totalEstimatedCompetitors": (integer around ${input.localContext.existingCompetitorCount}),
    "densityPerThousandPopulation": (float e.g. 0.45),
    "clusters": [
      {
        "name": "(e.g. ${input.location.block} Bus Stand cluster)",
        "distanceKm": 2.5,
        "scale": "Micro",
        "estimatedMarketShare": "35%",
        "keyAdvantage": "Established foot traffic but limited product variety"
      },
      {
        "name": "(e.g. ${input.location.panchayat} Market Link cluster)",
        "distanceKm": 4.8,
        "scale": "Informal",
        "estimatedMarketShare": "20%",
        "keyAdvantage": "Informal credit to village acquaintances"
      }
    ]
  },
  "pricingAndEconomics": {
    "summary": "(2 sentences on pricing benchmarks and margin viability)",
    "table": [
      {
        "itemOrService": "(Product 1)",
        "suggestedSellingPrice": "₹X per unit",
        "estimatedCostOfProduction": "₹Y per unit",
        "grossMarginPercent": 28,
        "estimatedMonthlyUnits": 450,
        "projectedMonthlyGrossProfit": 8500
      },
      {
        "itemOrService": "(Product 2)",
        "suggestedSellingPrice": "₹X per unit",
        "estimatedCostOfProduction": "₹Y per unit",
        "grossMarginPercent": 32,
        "estimatedMonthlyUnits": 220,
        "projectedMonthlyGrossProfit": 6500
      }
    ],
    "estimatedMonthlyRevenue": (integer e.g. 38000),
    "paybackPeriodMonths": (integer e.g. 14)
  }
}

Return ONLY valid JSON. Do not include markdown code block backticks.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const rawText = response.text ? response.text.trim() : "";
      if (rawText) {
        const cleaned = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
        const parsed = JSON.parse(cleaned);
        return {
          id: `rep_${Date.now()}`,
          userId: input.userId,
          generatedAt: new Date().toISOString(),
          isAiGenerated: true,
          citations: input.localContext.dataSourceFootnotes,
          ...parsed
        };
      }
    } catch (err) {
      console.warn("[Gemini API] Error during live AI generation, utilizing grounded fallback engine:", err);
    }
  }

  // Robust Grounded Algorithmic Generation (ensures flawless responsiveness even if offline/no key)
  return generateGroundedDeterministicReport(input);
}

export function generateGroundedDeterministicReport(input: FeasibilityInput) {
  const pCost = Math.round(input.marginCapital / 0.10);
  const blockPop = input.localContext.blockPopulation;
  const compCount = input.localContext.existingCompetitorCount;
  
  // Calculate weighted feasibility score
  const demandScore = 22;
  const compScore = Math.max(12, 19 - Math.min(6, Math.floor(compCount / 2)));
  const capitalScore = pCost >= 100000 ? 23 : 18;
  const seasonalScore = 12;
  const locationFitScore = 13;
  const totalScore = demandScore + compScore + capitalScore + seasonalScore + locationFitScore;

  const verdict = totalScore >= 80 ? 'High Feasibility' : totalScore >= 65 ? 'Moderate Feasibility' : 'Conditional Feasibility';

  return {
    id: `rep_${Date.now()}`,
    userId: input.userId,
    generatedAt: new Date().toISOString(),
    isAiGenerated: false,
    feasibilityScore: totalScore,
    verdict,
    verdictExplanation: `Based on local population density (${blockPop.toLocaleString('en-IN')}) in ${input.location.block} and an available capital of ₹${input.marginCapital.toLocaleString('en-IN')}, the proposed ${input.category} venture shows ${verdict.toLowerCase()} with manageable competition.`,
    scoreBreakdown: {
      localDemand: demandScore,
      competitionDensity: compScore,
      capitalAdequacy: capitalScore,
      seasonalRisk: seasonalScore,
      locationFit: locationFitScore
    },
    marketReach: {
      consumerBase5Km: Math.round(blockPop * 0.12),
      consumerBase10Km: Math.round(blockPop * 0.38),
      targetDemographics: `Rural households in ${input.location.panchayat}, local market visitors, and agricultural producers`,
      primaryDistributionChannels: [
        `Direct sales in ${input.location.panchayat} village center`,
        `Weekly Haat and Bazaar supply in ${input.location.block}`,
        `Consignment tie-up with nearby mandi wholesale retailers`
      ]
    },
    opportunityAnalysis: [
      {
        title: "Underserved Local Demand",
        description: `Currently ${input.location.panchayat} residents travel over 6 km to access reliable ${input.category} goods; establishing a local unit captures trapped rural demand.`,
        potentialImpact: "High"
      },
      {
        title: "Mandi Benchmark Price Advantage",
        description: `Using nearby APMC Mandi (${input.localContext.distanceToMandiKm} km) allows direct sourcing of inputs at wholesale spot rates: ${input.localContext.agmarknetPriceBenchmark.slice(0, 60)}...`,
        potentialImpact: "High"
      },
      {
        title: "MoSJE Concessional Scheme Backing",
        description: `Access to 6.5% - 8.0% interest rate finance with moratorium significantly lowers monthly debt burden compared to informal 24-36% moneylenders.`,
        potentialImpact: "Medium"
      }
    ],
    swot: {
      strengths: [
        "Low promoter margin requirement (only 10% self-investment)",
        "Direct familiarity with local community and village purchasing habits",
        "Proximity to raw materials and lower overhead costs in rural location"
      ],
      weaknesses: [
        "Limited working capital buffer during monsoon and harvest cycles",
        "Initial dependence on local word-of-mouth marketing"
      ],
      opportunities: [
        "Supply tie-ups with Women Self-Help Groups (SHGs) and local cooperatives",
        "Expansion into value-added packaging and bulk supplies for village weddings and festivals",
        "Subsidies under National Rural Livelihoods Mission (NRLM) and NBCFDC"
      ],
      threats: [
        "Seasonal cash flow fluctuations during crop planting periods",
        "Power interruptions affecting refrigeration or machinery runtime"
      ]
    },
    threats: [
      {
        id: "threat_1",
        riskName: "Seasonal Liquidity Squeeze",
        severity: "Medium",
        category: "Seasonality",
        mitigationStrategy: "Maintain a 45-day operational cash reserve and utilize the 3–6 month moratorium period wisely before principal repayments start."
      },
      {
        id: "threat_2",
        riskName: "Input Price Fluctuations",
        severity: "Low",
        category: "Supply Chain",
        mitigationStrategy: "Procure raw inventory directly during peak harvest cycles from the district APMC Mandi to lock in bulk wholesale rates."
      },
      {
        id: "threat_3",
        riskName: "Unpredictable Power Supply",
        severity: "Medium",
        category: "Regulatory",
        mitigationStrategy: "Leverage PM-KUSUM or rural solar lighting subsidy to incorporate an energy-efficient solar inverter backup for critical operations."
      }
    ],
    competitorMapping: {
      totalEstimatedCompetitors: compCount,
      densityPerThousandPopulation: +(compCount / (blockPop / 1000)).toFixed(2),
      clusters: [
        {
          name: `${input.location.block} Main Bazaar Cluster`,
          distanceKm: 3.2,
          scale: "Small",
          estimatedMarketShare: "40%",
          keyAdvantage: "Central crossroads location with long-standing customer loyalty"
        },
        {
          name: `${input.location.panchayat} Road Link Units`,
          distanceKm: 1.5,
          scale: "Micro",
          estimatedMarketShare: "22%",
          keyAdvantage: "Informal credit extended to known village kin"
        }
      ]
    },
    pricingAndEconomics: {
      summary: `Unit economics indicate a sustainable gross margin of 25%–35% when pricing is kept within rural affordability thresholds.`,
      table: [
        {
          itemOrService: "Primary Core Product / Service Unit",
          suggestedSellingPrice: "Market Benchmark - 5%",
          estimatedCostOfProduction: "65% of Sale Price",
          grossMarginPercent: 35,
          estimatedMonthlyUnits: 500,
          projectedMonthlyGrossProfit: 14000
        },
        {
          itemOrService: "Secondary Value-Added Variant",
          suggestedSellingPrice: "Premium Grade + 10%",
          estimatedCostOfProduction: "70% of Sale Price",
          grossMarginPercent: 30,
          estimatedMonthlyUnits: 250,
          projectedMonthlyGrossProfit: 9500
        }
      ],
      estimatedMonthlyRevenue: Math.round(pCost * 0.28),
      paybackPeriodMonths: Math.round((pCost * 0.9) / (pCost * 0.08))
    },
    citations: input.localContext.dataSourceFootnotes
  };
}

export async function generateChatReply(
  userMessage: string,
  userProfile: any,
  feasibilityData: any,
  language: 'en' | 'hi' = 'en'
): Promise<string> {
  const ai = getAiClient();

  if (ai) {
    try {
      const systemInstruction = `
You are "Udyam Mitra – AI Sahayak", an official, polite, and deeply knowledgeable digital advisory assistant for the Ministry of Social Justice and Empowerment (MoSJE), Government of India.
You assist rural and semi-urban micro-entrepreneurs from Backward Classes, Scheduled Castes, and EBC communities in understanding government concessional credit schemes (NBCFDC, NSFDC), local business feasibility reports, and loan calculations.

CURRENT CONTEXT OF USER:
- Applicant Name: ${userProfile?.name || 'Applicant'}
- Location: ${userProfile?.location ? `${userProfile.location.panchayat}, ${userProfile.location.block}, ${userProfile.location.district}, ${userProfile.location.state}` : 'Rural India'}
- Business Category: ${userProfile?.businessCategory || 'Micro Enterprise'}
- Margin Capital: ₹${userProfile?.marginCapital || 'N/A'}
- Feasibility Score: ${feasibilityData?.feasibilityScore || 'Evaluated'} (${feasibilityData?.verdict || 'High'})
- Matched Scheme: ${userProfile?.marginCapital && userProfile.marginCapital <= 14000 ? 'Micro Finance Scheme (6.5% p.a., 3-year tenure, 3-month moratorium)' : 'Term Loan Scheme (8% p.a., 7-year tenure, 6-month moratorium)'}

RULES:
1. Always be supportive, respectful, and authoritative yet simple to understand for a rural citizen.
2. If asked in Hindi or if language is 'hi', reply in clean, respectful Hindi (Devanagari script).
3. If the user asks a "what if" question about margin capital (e.g. "What if I have ₹80,000?"), calculate:
   - Project Cost = Margin Capital ÷ 10% (e.g. ₹80,000 ÷ 10% = ₹8,00,000)
   - Max Loan = 90% (e.g. ₹7,20,000)
   - Matching scheme: Term Loan Scheme (8% p.a. for 7 years, 6 months moratorium).
4. Explain terms like 'Moratorium' (moratorium means repayment relief period where no principal is collected, borrower only pays minimal nominal interest or it is deferred) clearly.
5. Keep your response concise (under 160 words) and directly actionable.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userMessage,
        config: {
          systemInstruction
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn("[Gemini Chat] Error:", err);
    }
  }

  // Fallback intelligent responder
  const lower = userMessage.toLowerCase();
  if (lower.includes("80,000") || lower.includes("80000")) {
    return language === 'hi'
      ? "यदि आपका स्वयं का अंशदान (Margin Capital) ₹80,000 है, तो 10% नियम के अनुसार आपका कुल प्रोजेक्ट आकार ₹8,00,000 (8 लाख) होगा। इसमें आप 90% यानी ₹7,20,000 तक मियादी ऋण (Term Loan Scheme) के पात्र होंगे। इस योजना में ब्याज दर मात्र 8% प्रति वर्ष, 7 वर्ष की अवधि तथा 6 माह का मोराटोरियम (अवकाश अवधि) उपलब्ध होगा।"
      : "If your available margin capital is ₹80,000, your total project cost qualifies for ₹8,00,000 (10% self-contribution). You will be eligible for a loan of up to ₹7,20,000 (90%) under the MoSJE Term Loan Scheme at a concessional interest rate of 8.0% p.a. with a 7-year tenure and a 6-month moratorium.";
  }

  if (lower.includes("moratorium") || lower.includes("मोराटोरियम") || lower.includes("अवकाश")) {
    return language === 'hi'
      ? "मोराटोरियम (Moratorium) का अर्थ ऋण चुकौती में प्रारंभिक राहत अवधि है। इस अवधि (सूक्ष्म वित्त में 3 माह, टर्म लोन में 6 माह) के दौरान आपको मूलधन (Principal) नहीं चुकाना होता, जिससे आप व्यवसाय स्थापित कर प्रारंभिक आय अर्जित कर सकें।"
      : "A moratorium is a grace period before principal repayments begin (3 months for Micro Finance, 6 months for Term Loans). During this time, your business gets breathing room to set up operations and generate initial revenue before regular installments commence.";
  }

  if (lower.includes("document") || lower.includes("दस्तावेज") || lower.includes("कागजात")) {
    return language === 'hi'
      ? "योजना हेतु आवश्यक दस्तावेज: 1) आधार कार्ड, 2) बैंक पासबुक (सक्रिय खाता), 3) जाति प्रमाण पत्र (OBC/SC/DNT/सफाई कर्मचारी), 4) निवास प्रमाण पत्र, 5) प्रोजेक्ट लागत कोटेशन, 6) पासपोर्ट साइज फोटो। आप इसे निकटतम जिला उद्योग केंद्र (DIC) अथवा राज्य चैनललाइजिंग एजेंसी (SCA) में जमा कर सकते हैं।"
      : "Required documents for application: 1) Aadhaar Card, 2) Bank Passbook (active account), 3) Category Certificate (OBC/SC/DNT/Safai Karamchari), 4) Domicile/Residence proof, 5) Machinery/equipment quotation, 6) Passport size photos. Submit these at your nearest District Industries Centre (DIC) or partner bank.";
  }

  return language === 'hi'
    ? `नमस्ते! मैं उद्यम मित्र हूँ। आपकी चयनित परियोजना ${userProfile?.businessCategory || 'व्यवसाय'} के लिए सामाजिक न्याय मंत्रालय की रियायती योजनाएं उपलब्ध हैं। आप ऋण पात्रता, ईएमआई, या आवश्यक दस्तावेजों के विषय में कोई भी प्रश्न पूछ सकते हैं।`
    : `Hello! I am Udyam Mitra, your AI Sahayak. For your ${userProfile?.businessCategory || 'business'} project in ${userProfile?.location?.district || 'your district'}, concessional MoSJE credit schemes are available. How can I assist you with eligibility, repayment calculations, or document requirements?`;
}
