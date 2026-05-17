// Usage Analytics System
// Tracks user interactions and testing activity

export interface UserSession {
  sessionId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  startTime: Date;
  lastActivity: Date;
  currentPage: string;
  testResults?: TestResult[];
}

export interface TestResult {
  testType: string;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
}

export interface PageView {
  sessionId: string;
  page: string;
  timestamp: Date;
  duration?: number;
}

// In-memory storage for demo (in production, use database)
let activeSessions: Map<string, UserSession> = new Map();
let pageViews: PageView[] = [];
let testActivities: TestResult[] = [];

export function trackSession(sessionId: string, req: any): UserSession {
  const session: UserSession = {
    sessionId,
    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    startTime: new Date(),
    lastActivity: new Date(),
    currentPage: '/',
  };
  
  activeSessions.set(sessionId, session);
  return session;
}

export function trackPageView(sessionId: string, page: string): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.currentPage = page;
    session.lastActivity = new Date();
  }
  
  pageViews.push({
    sessionId,
    page,
    timestamp: new Date(),
  });
}

export function trackTestActivity(sessionId: string, result: TestResult): void {
  const session = activeSessions.get(sessionId);
  if (session) {
    if (!session.testResults) {
      session.testResults = [];
    }
    session.testResults.push(result);
    session.lastActivity = new Date();
  }
  
  testActivities.push(result);
}

export function getActiveUsers(): number {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  let activeCount = 0;
  activeSessions.forEach(session => {
    if (session.lastActivity > fiveMinutesAgo) {
      activeCount++;
    }
  });
  
  return activeCount;
}

export function getCurrentTestTakers(): UserSession[] {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  
  const testTakers: UserSession[] = [];
  activeSessions.forEach(session => {
    if (session.lastActivity > tenMinutesAgo && 
        session.currentPage.includes('/test')) {
      testTakers.push(session);
    }
  });
  
  return testTakers;
}

export function getUsageStats() {
  const now = new Date();
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const stats = {
    activeUsers: getActiveUsers(),
    currentTestTakers: getCurrentTestTakers().length,
    todayPageViews: pageViews.filter(pv => pv.timestamp > today).length,
    hourlyPageViews: pageViews.filter(pv => pv.timestamp > lastHour).length,
    todayTests: testActivities.filter(ta => ta.completedAt > today).length,
    totalSessions: activeSessions.size,
    popularPages: getPopularPages(),
    testPerformance: getTestPerformanceStats(),
  };
  
  return stats;
}

function getPopularPages(): Array<{page: string, views: number}> {
  const pageCount: Record<string, number> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  pageViews.filter(pv => pv.timestamp > today).forEach(pv => {
    pageCount[pv.page] = (pageCount[pv.page] || 0) + 1;
  });
  
  return Object.entries(pageCount)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
}

function getTestPerformanceStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTests = testActivities.filter(ta => ta.completedAt > today);
  
  if (todayTests.length === 0) {
    return { averageScore: 0, totalTests: 0, averageTime: 0 };
  }
  
  const totalScore = todayTests.reduce((sum, test) => {
    return sum + (test.correctAnswers / test.questionsAnswered) * 100;
  }, 0);
  
  const totalTime = todayTests.reduce((sum, test) => sum + test.timeSpent, 0);
  
  return {
    averageScore: Math.round(totalScore / todayTests.length),
    totalTests: todayTests.length,
    averageTime: Math.round(totalTime / todayTests.length / 1000 / 60), // minutes
  };
}

// Clean up old sessions (run periodically)
export function cleanupOldSessions(): void {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  activeSessions.forEach((session, sessionId) => {
    if (session.lastActivity < oneHourAgo) {
      activeSessions.delete(sessionId);
    }
  });
  
  // Keep only last 1000 page views
  if (pageViews.length > 1000) {
    pageViews = pageViews.slice(-1000);
  }
  
  // Keep only last 500 test activities
  if (testActivities.length > 500) {
    testActivities = testActivities.slice(-500);
  }
}

// Generate unique session ID
export function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}