// AI Configuration - Controls all AI-powered features
export const AI_CONFIG = {
  SUSPENDED: false, // Set to false to resume AI activity
  OPENAI_ENABLED: true,
  ANTHROPIC_ENABLED: false, // Claude AI provider removed
  PERPLEXITY_ENABLED: true,
  REASON: ""
};

export function isAIEnabled(): boolean {
  return !AI_CONFIG.SUSPENDED;
}

export function getAIStatus(): string {
  return AI_CONFIG.SUSPENDED ? `AI suspended: ${AI_CONFIG.REASON}` : "AI active";
}

export function suspendAI(reason: string = "Manual suspension"): void {
  AI_CONFIG.SUSPENDED = true;
  AI_CONFIG.OPENAI_ENABLED = false;
  AI_CONFIG.ANTHROPIC_ENABLED = false; // Claude AI provider removed
  AI_CONFIG.PERPLEXITY_ENABLED = false;
  AI_CONFIG.REASON = reason;
  console.log(`🚫 AI activity suspended: ${reason}`);
}

export function resumeAI(): void {
  AI_CONFIG.SUSPENDED = false;
  AI_CONFIG.OPENAI_ENABLED = true;
  AI_CONFIG.ANTHROPIC_ENABLED = false; // Claude AI provider removed
  AI_CONFIG.PERPLEXITY_ENABLED = true;
  AI_CONFIG.REASON = "";
  console.log("✅ AI activity resumed");
}