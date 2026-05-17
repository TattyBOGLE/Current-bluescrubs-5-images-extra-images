import { generateUKMedicalQuestion, type UKMedicalQuestion } from './uk-medical-generator';
import fs from 'fs/promises';
import path from 'path';

// Medical specialties for comprehensive question bank
const MEDICAL_SPECIALTIES = [
  'cardiovascular',
  'respiratory', 
  'gastroenterology',
  'neurology',
  'endocrinology',
  'nephrology',
  'haematology',
  'psychiatry',
  'rheumatology',
  'infectious-diseases',
  'dermatology',
  'ophthalmology',
  'ent',
  'obstetrics-gynaecology',
  'paediatrics',
  'geriatrics',
  'emergency-medicine',
  'surgery',
  'orthopaedics',
  'radiology'
];

const DIFFICULTY_LEVELS = ['foundation', 'intermediate', 'advanced'];

interface BulkGenerationProgress {
  totalQuestions: number;
  generated: number;
  failed: number;
  currentSpecialty: string;
  currentDifficulty: string;
}

export class BulkUKQuestionGenerator {
  private progress: BulkGenerationProgress = {
    totalQuestions: 0,
    generated: 0,
    failed: 0,
    currentSpecialty: '',
    currentDifficulty: ''
  };

  private generatedQuestions: any[] = [];

  constructor(private targetTotal: number = 5000) {
    this.progress.totalQuestions = targetTotal;
  }

  async generateComprehensiveQuestionBank(): Promise<void> {
    const questionsPerSpecialty = Math.floor(this.targetTotal / MEDICAL_SPECIALTIES.length);
    const questionsPerDifficulty = Math.floor(questionsPerSpecialty / DIFFICULTY_LEVELS.length);

    console.log(`Generating ${this.targetTotal} questions across ${MEDICAL_SPECIALTIES.length} specialties`);
    console.log(`Target: ${questionsPerSpecialty} per specialty, ${questionsPerDifficulty} per difficulty level`);

    for (const specialty of MEDICAL_SPECIALTIES) {
      this.progress.currentSpecialty = specialty;
      
      for (const difficulty of DIFFICULTY_LEVELS) {
        this.progress.currentDifficulty = difficulty;
        
        console.log(`Generating ${questionsPerDifficulty} ${difficulty} questions for ${specialty}...`);
        
        await this.generateQuestionsForCategory(specialty, difficulty, questionsPerDifficulty);
        
        // Save progress periodically
        if (this.progress.generated % 100 === 0) {
          await this.saveProgress();
        }
        
        // Add delay to prevent API rate limiting
        await this.delay(2000);
      }
    }

    // Generate remaining questions to reach exact target
    const remaining = this.targetTotal - this.progress.generated;
    if (remaining > 0) {
      console.log(`Generating ${remaining} additional questions to reach target...`);
      await this.generateQuestionsForCategory('general-medicine', 'intermediate', remaining);
    }

    await this.saveAllQuestions();
    console.log(`Generation complete! Total: ${this.progress.generated}, Failed: ${this.progress.failed}`);
  }

  private async generateQuestionsForCategory(
    specialty: string, 
    difficulty: string, 
    count: number
  ): Promise<void> {
    for (let i = 0; i < count; i++) {
      try {
        const ukQuestion = await generateUKMedicalQuestion(specialty, difficulty);
        
        // Convert to standard format
        const standardQuestion = {
          id: `uk_${specialty}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`,
          stem: `${ukQuestion.scenario}\n\n${ukQuestion.question}`,
          options: [
            ukQuestion.options.A,
            ukQuestion.options.B, 
            ukQuestion.options.C,
            ukQuestion.options.D,
            ukQuestion.options.E
          ],
          correctAnswer: ['A', 'B', 'C', 'D', 'E'].indexOf(ukQuestion.correct_answer),
          explanation: ukQuestion.explanation,
          category: specialty,
          difficulty,
          references: ukQuestion.references.map(ref => ({
            text: ref.title,
            url: ref.url
          })),
          metadata: {
            generatedAt: new Date().toISOString(),
            source: 'uk-medical-generator',
            validated: true
          }
        };

        this.generatedQuestions.push(standardQuestion);
        this.progress.generated++;
        
        if (this.progress.generated % 10 === 0) {
          console.log(`Progress: ${this.progress.generated}/${this.targetTotal} (${Math.round(this.progress.generated/this.targetTotal*100)}%)`);
        }

      } catch (error) {
        console.error(`Failed to generate question ${i+1} for ${specialty}/${difficulty}:`, error);
        this.progress.failed++;
        
        // Add delay before retry
        await this.delay(1000);
      }
    }
  }

  private async saveProgress(): Promise<void> {
    try {
      const progressData = {
        ...this.progress,
        lastSaved: new Date().toISOString(),
        questionsGenerated: this.generatedQuestions.length
      };
      
      await fs.writeFile(
        path.join(process.cwd(), 'uk-generation-progress.json'),
        JSON.stringify(progressData, null, 2)
      );
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  private async saveAllQuestions(): Promise<void> {
    try {
      // Save as JSON file
      await fs.writeFile(
        path.join(process.cwd(), 'uk-question-bank.json'),
        JSON.stringify({
          metadata: {
            totalQuestions: this.generatedQuestions.length,
            generatedAt: new Date().toISOString(),
            specialties: MEDICAL_SPECIALTIES,
            difficultyLevels: DIFFICULTY_LEVELS
          },
          questions: this.generatedQuestions
        }, null, 2)
      );

      // Save by specialty for easier management
      const questionsBySpecialty = this.generatedQuestions.reduce((acc, question) => {
        if (!acc[question.category]) {
          acc[question.category] = [];
        }
        acc[question.category].push(question);
        return acc;
      }, {} as Record<string, any[]>);

      for (const [specialty, questions] of Object.entries(questionsBySpecialty)) {
        await fs.writeFile(
          path.join(process.cwd(), `uk-questions-${specialty}.json`),
          JSON.stringify(questions, null, 2)
        );
      }

      console.log(`Saved ${this.generatedQuestions.length} questions to files`);
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getProgress(): BulkGenerationProgress {
    return { ...this.progress };
  }
}

// Utility function to start bulk generation
export async function generateFullQuestionBank(targetCount: number = 5000): Promise<void> {
  const generator = new BulkUKQuestionGenerator(targetCount);
  await generator.generateComprehensiveQuestionBank();
}

// Function to load existing question bank
export async function loadUKQuestionBank(): Promise<any[]> {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'uk-question-bank.json'), 'utf-8');
    const questionBank = JSON.parse(data);
    return questionBank.questions || [];
  } catch (error) {
    console.log('No existing question bank found, will generate new questions');
    return [];
  }
}