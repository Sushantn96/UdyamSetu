/**
 * In-memory & Persistent Schema Store for Udyam Disha Portal
 * In production this would connect to PostgreSQL (via Drizzle/Prisma) or Firestore.
 */

export interface DbUser {
  id: string;
  name: string;
  mobile: string;
  aadhaarMasked: string;
  category: string;
  state: string;
  district: string;
  block: string;
  panchayat: string;
  marginCapital: number;
  businessCategory: string;
  customIdeaDescription?: string;
  createdAt: string;
}

export interface DbFeasibilityReport {
  id: string;
  userId: string;
  category: string;
  state: string;
  district: string;
  block: string;
  panchayat: string;
  data: any;
  createdAt: string;
}

export interface DbLocalContextCache {
  key: string; // state:district:block:category
  context: any;
  cachedAt: number;
}

class InMemoryDataStore {
  private users: Map<string, DbUser> = new Map();
  private reports: Map<string, DbFeasibilityReport> = new Map();
  private cache: Map<string, DbLocalContextCache> = new Map();
  private chatSessions: Map<string, any[]> = new Map();

  constructor() {
    // Seed with a sample user for instant demonstration
    const defaultUser: DbUser = {
      id: "usr_demo_772",
      name: "Rameshwar Prasad",
      mobile: "9876543210",
      aadhaarMasked: "XXXX-XXXX-4819",
      category: "OBC",
      state: "Uttar Pradesh",
      district: "Varanasi",
      block: "Sevapuri",
      panchayat: "Adampur",
      marginCapital: 12000,
      businessCategory: "dairy",
      customIdeaDescription: "Small dairy unit with 2 graded Murrah buffaloes and a milk collection chilling point for village cooperative.",
      createdAt: new Date().toISOString()
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  saveUser(user: DbUser): DbUser {
    this.users.set(user.id, user);
    return user;
  }

  getUser(id: string): DbUser | undefined {
    return this.users.get(id);
  }

  saveReport(report: DbFeasibilityReport): DbFeasibilityReport {
    this.reports.set(report.id, report);
    return report;
  }

  getReport(id: string): DbFeasibilityReport | undefined {
    return this.reports.get(id);
  }

  getReportsByUserId(userId: string): DbFeasibilityReport[] {
    return Array.from(this.reports.values()).filter(r => r.userId === userId);
  }

  getCachedContext(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    // Cache valid for 24 hours
    if (Date.now() - item.cachedAt > 24 * 60 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }
    return item.context;
  }

  setCachedContext(key: string, context: any): void {
    this.cache.set(key, {
      key,
      context,
      cachedAt: Date.now()
    });
  }

  getChatHistory(sessionId: string): any[] {
    return this.chatSessions.get(sessionId) || [];
  }

  appendChatMessage(sessionId: string, message: any): void {
    const history = this.getChatHistory(sessionId);
    history.push(message);
    this.chatSessions.set(sessionId, history);
  }
}

export const db = new InMemoryDataStore();
