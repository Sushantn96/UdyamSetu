import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/dataStore";
import { fetchAndNormalizeLocalMarketContext, startScheduledScraperJob } from "./server/scraperService";
import { generateFeasibilityReportWithAi, generateChatReply } from "./server/aiService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS and safety headers for iframe embedding
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // Start simulated scheduled background scraping / data refresh
  startScheduledScraperJob();

  // 1. Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "Udyam Disha API Gateway",
      timestamp: new Date().toISOString(),
      ministry: "Ministry of Social Justice and Empowerment (MoSJE)"
    });
  });

  // 2. User Onboarding (POST /api/users)
  app.post("/api/users", (req, res) => {
    try {
      const { name, mobile, aadhaarMasked, category, location, marginCapital, businessCategory, customIdeaDescription } = req.body;
      
      const id = req.body.id || `usr_${Date.now()}`;
      const user = db.saveUser({
        id,
        name: name || "Anonymous Entrepreneur",
        mobile: mobile || "9876543210",
        aadhaarMasked: aadhaarMasked || "XXXX-XXXX-0000",
        category: category || "OBC",
        state: location?.state || "Uttar Pradesh",
        district: location?.district || "Varanasi",
        block: location?.block || "Sevapuri",
        panchayat: location?.panchayat || "Adampur",
        marginCapital: Number(marginCapital) || 12000,
        businessCategory: businessCategory || "dairy",
        customIdeaDescription: customIdeaDescription || "",
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Get User Profile & Past Reports (GET /api/users/:id)
  app.get("/api/users/:id", (req, res) => {
    const user = db.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const reports = db.getReportsByUserId(user.id);
    res.json({ success: true, user, reports });
  });

  // 4. Local Market Context Scraping & Normalization (GET /api/local-context)
  app.get("/api/local-context", async (req, res) => {
    try {
      const state = (req.query.state as string) || "Uttar Pradesh";
      const district = (req.query.district as string) || "Varanasi";
      const block = (req.query.block as string) || "Sevapuri";
      const panchayat = (req.query.panchayat as string) || "Adampur";
      const category = (req.query.category as string) || "dairy";

      const context = await fetchAndNormalizeLocalMarketContext(state, district, block, panchayat, category);
      res.json({ success: true, context });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Generate Feasibility Report (POST /api/feasibility)
  app.post("/api/feasibility", async (req, res) => {
    try {
      const { userId, name, category, businessCategory, marginCapital, location, customIdeaDescription } = req.body;
      const bizCategory = businessCategory || (category && !['SC', 'OBC', 'DNT', 'EBC', 'General', 'SafaiKaramchari'].includes(category) ? category : "dairy");
      
      const loc = location || {
        state: "Uttar Pradesh",
        district: "Varanasi",
        block: "Sevapuri",
        panchayat: "Adampur"
      };

      const localContext = await fetchAndNormalizeLocalMarketContext(
        loc.state,
        loc.district,
        loc.block,
        loc.panchayat,
        bizCategory
      );

      const report = await generateFeasibilityReportWithAi({
        userId: userId || "usr_guest",
        name: name || "Entrepreneur",
        category: bizCategory,
        marginCapital: Number(marginCapital) || 12000,
        location: loc,
        customIdeaDescription,
        localContext
      });

      // Save to database
      db.saveReport({
        id: report.id,
        userId: report.userId,
        category: bizCategory,
        state: loc.state,
        district: loc.district,
        block: loc.block,
        panchayat: loc.panchayat,
        data: report,
        createdAt: report.generatedAt
      });

      res.json({ success: true, report, localContext });
    } catch (err: any) {
      console.error("Error generating feasibility report:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Financial Calculation (POST /api/finance/calculate)
  app.post("/api/finance/calculate", (req, res) => {
    try {
      const marginCapital = Number(req.body.marginCapital) || 10000;
      const projectCost = Math.round(marginCapital / 0.10);
      
      const isMicro = projectCost <= 140000;
      const scheme = isMicro ? {
        schemeId: "MICRO_FINANCE",
        schemeName: "MoSJE Micro Finance Scheme",
        interestRateAnnual: 6.5,
        tenureYears: 3,
        moratoriumMonths: 3,
        maxLoanAmount: 125000,
        promoterMarginPercent: 10
      } : {
        schemeId: "TERM_LOAN",
        schemeName: "MoSJE Term Loan Scheme",
        interestRateAnnual: 8.0,
        tenureYears: 7,
        moratoriumMonths: 6,
        maxLoanAmount: 4500000,
        promoterMarginPercent: 10
      };

      const maxLoan = Math.min(Math.round(projectCost * 0.90), scheme.maxLoanAmount);

      res.json({
        success: true,
        calculation: {
          marginCapital,
          projectCost,
          maxLoanEligibility: maxLoan,
          scheme
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Chat Assistant (POST /api/chat)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userProfile, feasibilityData, language } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: "Message is required" });
      }

      const reply = await generateChatReply(
        message,
        userProfile,
        feasibilityData,
        language || 'en'
      );

      res.json({
        success: true,
        reply,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Udyam Disha Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
