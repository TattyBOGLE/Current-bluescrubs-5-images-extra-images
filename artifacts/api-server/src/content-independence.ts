// Content Independence System
// Eliminates reliance on external AI services for medical content generation

import fs from 'fs';

export interface ContentStats {
  totalStations: number;
  byExamType: Record<string, number>;
  lastUpdated: string;
  aiDependency: 'none' | 'optional' | 'required';
}

export function getContentIndependenceStatus(): ContentStats {
  const stats: ContentStats = {
    totalStations: 0,
    byExamType: {},
    lastUpdated: new Date().toISOString(),
    aiDependency: 'none'
  };

  // Count existing user format stations (PLAB 2)
  try {
    if (fs.existsSync('generated-user-format-stations.json')) {
      const data = fs.readFileSync('generated-user-format-stations.json', 'utf8');
      const stations = JSON.parse(data);
      stats.totalStations += stations.length;
      stats.byExamType['PLAB2'] = stations.length;
    }
  } catch (error) {
    console.error('Error reading PLAB 2 stations:', error);
  }

  // Count international exam stations
  const examTypes = ['USMLE', 'AMC', 'MCCQE', 'SCHS', 'DHA', 'HAAD'];
  examTypes.forEach(examType => {
    try {
      const filename = `generated-${examType.toLowerCase()}-stations.json`;
      if (fs.existsSync(filename)) {
        const data = fs.readFileSync(filename, 'utf8');
        const stations = JSON.parse(data);
        stats.totalStations += stations.length;
        stats.byExamType[examType] = stations.length;
      }
    } catch (error) {
      console.error(`Error reading ${examType} stations:`, error);
    }
  });

  return stats;
}

export function createManualStation(examType: string, stationData: any): boolean {
  try {
    const filename = examType === 'PLAB2' 
      ? 'generated-user-format-stations.json'
      : `generated-${examType.toLowerCase()}-stations.json`;
    
    let existingStations = [];
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      existingStations = JSON.parse(data);
    }

    stationData.id = `manual-${examType.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    stationData.created_method = 'manual';
    stationData.created_at = new Date().toISOString();

    existingStations.push(stationData);
    fs.writeFileSync(filename, JSON.stringify(existingStations, null, 2));
    
    console.log(`Manual station added to ${examType}: ${stationData.scenario_title}`);
    return true;
  } catch (error) {
    console.error(`Error adding manual station to ${examType}:`, error);
    return false;
  }
}

export function exportContentLibrary(examType?: string): any[] {
  const allContent: any[] = [];

  if (!examType || examType === 'PLAB2') {
    try {
      if (fs.existsSync('generated-user-format-stations.json')) {
        const data = fs.readFileSync('generated-user-format-stations.json', 'utf8');
        const stations = JSON.parse(data);
        allContent.push(...stations.map((s: any) => ({...s, examType: 'PLAB2'})));
      }
    } catch (error) {
      console.error('Error exporting PLAB 2 content:', error);
    }
  }

  const examTypes = ['USMLE', 'AMC', 'MCCQE', 'SCHS', 'DHA', 'HAAD'];
  examTypes.forEach(type => {
    if (!examType || examType === type) {
      try {
        const filename = `generated-${type.toLowerCase()}-stations.json`;
        if (fs.existsSync(filename)) {
          const data = fs.readFileSync(filename, 'utf8');
          const stations = JSON.parse(data);
          allContent.push(...stations.map((s: any) => ({...s, examType: type})));
        }
      } catch (error) {
        console.error(`Error exporting ${type} content:`, error);
      }
    }
  });

  return allContent;
}

export function validateContentSufficiency(examType: string, minimumStations: number = 500): {
  sufficient: boolean;
  currentCount: number;
  recommended: string[];
} {
  const stats = getContentIndependenceStatus();
  const currentCount = stats.byExamType[examType] || 0;
  
  const result = {
    sufficient: currentCount >= minimumStations,
    currentCount,
    recommended: [] as string[]
  };

  if (!result.sufficient) {
    result.recommended.push(`Add ${minimumStations - currentCount} more stations for ${examType}`);
    result.recommended.push('Consider manual station creation using existing templates');
    result.recommended.push('Import content from medical education resources');
  } else {
    result.recommended.push('Content library is self-sufficient');
    result.recommended.push('No external AI dependency required');
  }

  return result;
}