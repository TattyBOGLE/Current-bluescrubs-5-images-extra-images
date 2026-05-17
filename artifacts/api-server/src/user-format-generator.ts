import OpenAI from 'openai';
import { userFormatTemplates } from './user-format-templates';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'placeholder-configure-openai-key',
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const stationTypes = [
  'Cardiology',
  'Respiratory', 
  'Gastroenterology',
  'Neurology',
  'Emergency Medicine',
  'Ethics',
  'Psychiatry',
  'Obstetrics & Gynaecology',
  'Paediatrics',
  'Surgery',
  'Endocrinology'
];

const specialties = [
  'cardiology', 'respiratory', 'gastroenterology', 'neurology',
  'endocrinology', 'psychiatry', 'emergency-medicine', 'pediatrics',
  'obstetrics-gynecology', 'surgery', 'orthopedics'
];

let generatedStations: any[] = [];

export async function generateUserFormatStations(count: number = 10): Promise<any[]> {
  const stations = [];
  
  for (let i = 0; i < count; i++) {
    const stationType = stationTypes[Math.floor(Math.random() * stationTypes.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    
    try {
      const prompt = `Generate 1 authentic PLAB 2 OSCE station using this EXACT format:

${JSON.stringify(userFormatTemplates[0], null, 2)}

Requirements:
- Station type: ${stationType}
- Create realistic UK clinical scenario for ${specialty}
- Brief should be: "This is a station about [condition/scenario]. Take history, examine, explain, or counsel appropriately."
- Actor script should be concise with realistic patient responses
- Mark scheme should have 5 clear, practical assessment points
- Include appropriate mnemonic for the specialty/condition
- Communication notes should be specialty-specific
- Use the standard guideline links (NICE, GMC, BNF, Resus)
- Ensure clinical accuracy for PLAB 2 level

Return only the JSON object, no additional text.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
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
          station.id = `user-format-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          stations.push(station);
          console.log(`Generated ${stationType} station for ${specialty}`);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Raw content:', content);
        }
      }
    } catch (error) {
      console.error(`Error generating station ${i + 1}:`, error);
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return stations;
}

export function saveUserFormatStations(stations: any[]) {
  generatedStations = [...generatedStations, ...stations];
  
  const allStations = [...userFormatTemplates, ...generatedStations];
  
  fs.writeFileSync('generated-user-format-stations.json', JSON.stringify(allStations, null, 2));
  console.log(`Saved ${allStations.length} stations to user format file`);
  
  return allStations.length;
}

export function loadUserFormatStations(): any[] {
  try {
    if (fs.existsSync('generated-user-format-stations.json')) {
      const data = fs.readFileSync('generated-user-format-stations.json', 'utf8');
      const stations = JSON.parse(data);
      generatedStations = stations.slice(3); // Remove templates from generated count
      console.log(`Loaded ${stations.length} user format stations from storage`);
      return stations;
    }
  } catch (error) {
    console.error('Error loading user format stations:', error);
  }
  
  return [...userFormatTemplates];
}

export function getUserFormatStationCount(): number {
  return userFormatTemplates.length + generatedStations.length;
}