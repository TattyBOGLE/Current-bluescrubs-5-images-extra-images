import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'placeholder-configure-openai-key',
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// International Medical Exam Formats
const examFormats = {
  USMLE: {
    name: 'United States Medical Licensing Examination',
    country: 'USA',
    stationTypes: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Psychiatry', 'Obstetrics & Gynecology', 'Family Medicine', 'Emergency Medicine']
  },
  AMC: {
    name: 'Australian Medical Council',
    country: 'Australia', 
    stationTypes: ['General Practice', 'Internal Medicine', 'Surgery', 'Emergency Medicine', 'Psychiatry', 'Pediatrics', 'Rural Medicine']
  },
  MCCQE: {
    name: 'Medical Council of Canada Qualifying Examination',
    country: 'Canada',
    stationTypes: ['Family Medicine', 'Internal Medicine', 'Surgery', 'Pediatrics', 'Psychiatry', 'Emergency Medicine', 'Community Health']
  },
  SCHS: {
    name: 'Saudi Commission for Health Specialties',
    country: 'Saudi Arabia',
    stationTypes: ['Internal Medicine', 'Surgery', 'Emergency Medicine', 'Family Medicine', 'Pediatrics', 'Obstetrics & Gynecology', 'Islamic Medical Ethics']
  },
  DHA: {
    name: 'Dubai Health Authority',
    country: 'UAE',
    stationTypes: ['Emergency Medicine', 'Internal Medicine', 'Surgery', 'Family Medicine', 'Pediatrics', 'Critical Care', 'Public Health']
  },
  HAAD: {
    name: 'Health Authority Abu Dhabi',
    country: 'UAE',
    stationTypes: ['Emergency Medicine', 'Internal Medicine', 'Surgery', 'Family Medicine', 'Pediatrics', 'Preventive Medicine', 'Quality & Safety']
  }
};

// Global exam template matching user's preferred format
const globalExamTemplate = {
  "station_type": "Internal Medicine",
  "scenario_title": "Diabetes Management in Primary Care",
  "brief": "This is a station about diabetes management. Take history, examine, explain, or counsel appropriately.",
  "actor_script": {
    "opening": "Doctor, I'm worried about my blood sugar...",
    "details": "Patient explains diabetic concerns when prompted with empathy.",
    "hidden_info": "More revealed if candidate probes correctly."
  },
  "mark_scheme": [
    "Introduces and clarifies role",
    "Explores presenting concern thoroughly", 
    "Demonstrates clinical reasoning",
    "Explains next steps and involves patient",
    "Empathy and rapport throughout"
  ],
  "mnemonic": "HbA1c + Lifestyle Management",
  "communication_notes": "Ensure clarity, empathy, and shared decision-making for chronic disease management.",
  "guideline_links": {
    "ADA": "https://www.diabetes.org/professionals/standards",
    "WHO": "https://www.who.int/health-topics/diabetes",
    "Local": "https://example.com/local-guidelines",
    "International": "https://www.idf.org/guidelines"
  },
  "exam_specific": {
    "exam_type": "USMLE",
    "country": "USA",
    "duration": "15 minutes",
    "difficulty": "intermediate"
  }
};

let generatedInternationalStations: any[] = [];

export async function generateInternationalStations(examType: string, count: number = 5): Promise<any[]> {
  const stations = [];
  const examConfig = examFormats[examType as keyof typeof examFormats];
  
  if (!examConfig) {
    throw new Error(`Unsupported exam type: ${examType}`);
  }
  
  for (let i = 0; i < count; i++) {
    const stationType = examConfig.stationTypes[Math.floor(Math.random() * examConfig.stationTypes.length)];
    
    try {
      const prompt = `Generate 1 authentic ${examType} clinical station using this EXACT format:

${JSON.stringify(globalExamTemplate, null, 2)}

Requirements:
- Exam type: ${examType} (${examConfig.name})
- Country: ${examConfig.country}
- Station type: ${stationType}
- Brief should be: "This is a station about [condition/scenario]. Take history, examine, explain, or counsel appropriately."
- Actor script should be concise with realistic patient responses
- Mark scheme should have 5 clear, practical assessment points
- Include appropriate mnemonic for the specialty/condition
- Communication notes should be culturally appropriate for ${examConfig.country}
- Use relevant guidelines for ${examConfig.country}
- Update exam_specific section with correct exam details
- Ensure clinical accuracy for ${examType} level

Return only the JSON object, no additional text.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1200
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (content) {
        try {
          // Clean the response to extract JSON
          let cleanContent = content;
          if (content.includes('```json')) {
            cleanContent = content.split('```json')[1].split('```')[0].trim();
          } else if (content.includes('```')) {
            cleanContent = content.split('```')[1].trim();
          }
          
          const station = JSON.parse(cleanContent);
          station.id = `${examType.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          stations.push(station);
          console.log(`Generated ${examType} ${stationType} station`);
        } catch (parseError) {
          console.error(`JSON parse error for ${examType}:`, parseError);
        }
      }
    } catch (error) {
      console.error(`Error generating ${examType} station ${i + 1}:`, error);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  
  return stations;
}

export function saveInternationalStations(examType: string, stations: any[]) {
  generatedInternationalStations = [...generatedInternationalStations, ...stations];
  
  const filename = `generated-${examType.toLowerCase()}-stations.json`;
  let existingStations = [];
  
  try {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      existingStations = JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error loading existing ${examType} stations:`, error);
  }
  
  const allStations = [...existingStations, ...stations];
  
  fs.writeFileSync(filename, JSON.stringify(allStations, null, 2));
  console.log(`Saved ${allStations.length} ${examType} stations to ${filename}`);
  
  return allStations.length;
}

export function loadInternationalStations(examType: string): any[] {
  try {
    const filename = `generated-${examType.toLowerCase()}-stations.json`;
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      const stations = JSON.parse(data);
      console.log(`Loaded ${stations.length} ${examType} stations from storage`);
      return stations;
    }
  } catch (error) {
    console.error(`Error loading ${examType} stations:`, error);
  }
  
  return [];
}

export function getInternationalStationCount(examType: string): number {
  return loadInternationalStations(examType).length;
}

export function getSupportedExams(): string[] {
  return Object.keys(examFormats);
}