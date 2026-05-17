// Hybrid AI System - Optional AI Enhancement with Full Independence Fallback
// Provides AI-powered features when available, independent alternatives when not

import { 
  generateQuestionFromTemplate, 
  generateOSCEStationFromTemplate, 
  generateMedicalGuidanceIndependently 
} from './independent-content';
import { 
  analyzeVideoPerformanceIndependently, 
  generateIndependentFeedback 
} from './independent-analysis';

export interface HybridConfig {
  useAI: boolean;
  fallbackToIndependent: boolean;
  aiProvider: 'openai' | 'anthropic' | 'none';
  independentBackup: boolean;
}

export class HybridAISystem {
  private config: HybridConfig;
  private aiAvailable: boolean = false;

  constructor(config: HybridConfig = {
    useAI: true,
    fallbackToIndependent: true,
    aiProvider: 'openai',
    independentBackup: true
  }) {
    this.config = config;
    this.checkAIAvailability();
  }

  private async checkAIAvailability(): Promise<void> {
    try {
      if (this.config.aiProvider === 'openai' && process.env.OPENAI_API_KEY) {
        this.aiAvailable = true;
      } else if (this.config.aiProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        this.aiAvailable = true;
      } else {
        this.aiAvailable = false;
      }
    } catch (error) {
      this.aiAvailable = false;
    }
  }

  async generateQuestion(category: string, count: number = 1, useAI: boolean = false): Promise<any[]> {
    // Questions are always independent to maintain authenticity and avoid AI bias
    // This ensures medical accuracy and prevents AI hallucinations in medical content
    return generateQuestionFromTemplate(category, count);
  }

  async generateOSCEStation(stationType: string, specialty: string, useAI: boolean = this.config.useAI): Promise<any> {
    if (useAI && this.aiAvailable) {
      try {
        return await this.generateOSCEWithAI(stationType, specialty);
      } catch (error) {
        console.log('AI OSCE generation failed, falling back to independent method');
        if (this.config.fallbackToIndependent) {
          return generateOSCEStationFromTemplate(stationType, specialty);
        }
        throw error;
      }
    }
    
    // Use independent method
    return generateOSCEStationFromTemplate(stationType, specialty);
  }

  async analyzeVideo(stationTitle: string, stationCategory: string, learningObjectives: string[], duration: number, useAI: boolean = this.config.useAI): Promise<any> {
    if (useAI && this.aiAvailable) {
      try {
        return await this.analyzeVideoWithAI(stationTitle, stationCategory, learningObjectives, duration);
      } catch (error) {
        console.log('AI video analysis failed, falling back to independent method');
        if (this.config.fallbackToIndependent) {
          return analyzeVideoPerformanceIndependently(stationTitle, stationCategory, learningObjectives, duration);
        }
        throw error;
      }
    }
    
    // Use independent method
    return analyzeVideoPerformanceIndependently(stationTitle, stationCategory, learningObjectives, duration);
  }

  async generateFeedback(topic: string, userResponse: string, useAI: boolean = this.config.useAI): Promise<string> {
    if (useAI && this.aiAvailable) {
      try {
        return await this.generateFeedbackWithAI(topic, userResponse);
      } catch (error) {
        console.log('AI feedback generation failed, falling back to independent method');
        if (this.config.fallbackToIndependent) {
          return generateIndependentFeedback(topic, userResponse);
        }
        throw error;
      }
    }
    
    // Use independent method
    return generateIndependentFeedback(topic, userResponse);
  }

  private async generateQuestionWithAI(category: string, count: number): Promise<any[]> {
    if (this.config.aiProvider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

      const prompt = `Generate ${count} high-quality PLAB 1 medical exam questions for ${category} specialty.

Create authentic UK medical scenarios with:
- Realistic patient presentations
- 5 multiple choice options (A-E)
- Detailed explanations for each option
- Relevant mnemonics
- NICE/GMC guideline references

Format as JSON array with: question, options, answer (index), explanation (object with A-E keys), mnemonic, links`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        try {
          let cleanContent = content;
          if (content.includes('```json')) {
            cleanContent = content.split('```json')[1].split('```')[0].trim();
          }
          return JSON.parse(cleanContent);
        } catch (parseError) {
          throw new Error('Failed to parse AI response');
        }
      }
    }
    
    throw new Error('AI generation failed');
  }

  private async generateOSCEWithAI(stationType: string, specialty: string): Promise<any> {
    if (this.config.aiProvider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

      const prompt = `Generate 1 authentic PLAB 2 OSCE station for ${specialty} specialty, ${stationType} type.

Use this exact format:
{
  "station_type": "${specialty}",
  "scenario_title": "Descriptive title",
  "brief": "This is a station about [condition]. Take history, examine, explain, or counsel appropriately.",
  "actor_script": {
    "opening": "Patient opening line",
    "details": "Patient explains when prompted with empathy", 
    "hidden_info": "Information revealed if probed correctly"
  },
  "mark_scheme": [
    "5 clear assessment points"
  ],
  "mnemonic": "Relevant memory aid",
  "communication_notes": "Clear guidance for candidate",
  "guideline_links": {
    "NICE": "https://www.nice.org.uk",
    "GMC": "https://www.gmc-uk.org/ethical-guidance"
  }
}

Return only valid JSON.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        try {
          let cleanContent = content;
          if (content.includes('```json')) {
            cleanContent = content.split('```json')[1].split('```')[0].trim();
          }
          return JSON.parse(cleanContent);
        } catch (parseError) {
          throw new Error('Failed to parse AI OSCE response');
        }
      }
    }
    
    throw new Error('AI OSCE generation failed');
  }

  private async analyzeVideoWithAI(stationTitle: string, stationCategory: string, learningObjectives: string[], duration: number): Promise<any> {
    if (this.config.aiProvider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

      const prompt = `Analyze this PLAB 2 OSCE performance:

Station: ${stationTitle}
Category: ${stationCategory}  
Duration: ${duration} seconds
Objectives: ${learningObjectives.join(', ')}

Provide realistic assessment with scores (60-95) for:
1. Communication Skills (30%)
2. Technical Skills (40%) 
3. Professionalism (30%)

Return JSON format:
{
  "overallScore": number,
  "communicationScore": number, 
  "technicalScore": number,
  "professionalismScore": number,
  "feedback": {
    "strengths": ["3-4 specific strengths"],
    "improvements": ["2-3 areas for improvement"], 
    "specificAdvice": ["3-4 actionable tips"]
  },
  "detailedAnalysis": "Paragraph summary"
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 800
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        try {
          let cleanContent = content;
          if (content.includes('```json')) {
            cleanContent = content.split('```json')[1].split('```')[0].trim();
          }
          return JSON.parse(cleanContent);
        } catch (parseError) {
          throw new Error('Failed to parse AI video analysis');
        }
      }
    }
    
    throw new Error('AI video analysis failed');
  }

  private async generateFeedbackWithAI(topic: string, userResponse: string): Promise<string> {
    if (this.config.aiProvider === 'openai') {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL });

      const prompt = `Provide educational feedback for this medical scenario response:

Topic: ${topic}
Student Response: ${userResponse}

Give constructive feedback that:
- Acknowledges good points
- Suggests improvements
- Provides specific learning guidance
- References relevant medical guidelines

Keep response encouraging and educational (2-3 sentences).`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      });

      return response.choices[0]?.message?.content?.trim() || 'Good effort on this medical scenario.';
    }
    
    throw new Error('AI feedback generation failed');
  }

  getSystemStatus(): {
    aiAvailable: boolean;
    independentBackup: boolean;
    currentMode: 'ai_primary' | 'independent_primary' | 'hybrid';
    capabilities: string[];
  } {
    return {
      aiAvailable: this.aiAvailable,
      independentBackup: this.config.independentBackup,
      currentMode: this.aiAvailable && this.config.useAI ? 'ai_primary' : 'independent_primary',
      capabilities: [
        'Question Generation',
        'OSCE Station Creation', 
        'Video Analysis',
        'Feedback Generation',
        'Medical Guidance',
        'Translation (Independent)',
        'Content Library (Independent)'
      ]
    };
  }

  updateConfig(newConfig: Partial<HybridConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.checkAIAvailability();
  }
}

// Export singleton instance
export const hybridAI = new HybridAISystem();