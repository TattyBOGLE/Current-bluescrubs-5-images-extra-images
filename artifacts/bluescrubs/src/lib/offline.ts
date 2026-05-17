// Offline functionality for BlueScrubsPrep platform
interface OfflineData {
  questions: any[];
  progress: any;
  studyPlans: any[];
  userSettings: any;
  lastSync: number;
}

class OfflineManager {
  private dbName = 'nhsprep_offline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Questions store
        if (!db.objectStoreNames.contains('questions')) {
          const questionsStore = db.createObjectStore('questions', { keyPath: 'id' });
          questionsStore.createIndex('category', 'category', { unique: false });
          questionsStore.createIndex('difficulty', 'difficulty', { unique: false });
        }
        
        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'userId' });
        }
        
        // Study plans store
        if (!db.objectStoreNames.contains('studyPlans')) {
          db.createObjectStore('studyPlans', { keyPath: 'id' });
        }
        
        // User settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        // Offline content store
        if (!db.objectStoreNames.contains('content')) {
          const contentStore = db.createObjectStore('content', { keyPath: 'id' });
          contentStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async storeQuestions(questions: any[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['questions'], 'readwrite');
    const store = transaction.objectStore('questions');
    
    for (const question of questions) {
      await store.put(question);
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getQuestions(category?: string, difficulty?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['questions'], 'readonly');
    const store = transaction.objectStore('questions');
    
    let request;
    if (category) {
      const index = store.index('category');
      request = index.getAll(category);
    } else {
      request = store.getAll();
    }
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        let results = request.result;
        if (difficulty) {
          results = results.filter((q: any) => q.difficulty === difficulty);
        }
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async storeProgress(userId: string, progress: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['progress'], 'readwrite');
    const store = transaction.objectStore('progress');
    
    await store.put({ userId, ...progress, lastUpdated: Date.now() });
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getProgress(userId: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['progress'], 'readonly');
    const store = transaction.objectStore('progress');
    const request = store.get(userId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async storeStudyPlan(plan: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['studyPlans'], 'readwrite');
    const store = transaction.objectStore('studyPlans');
    
    await store.put(plan);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getStudyPlans(): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['studyPlans'], 'readonly');
    const store = transaction.objectStore('studyPlans');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async storeContent(content: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['content'], 'readwrite');
    const store = transaction.objectStore('content');
    
    await store.put(content);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getContent(type?: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    const transaction = this.db.transaction(['content'], 'readonly');
    const store = transaction.objectStore('content');
    
    let request;
    if (type) {
      const index = store.index('type');
      request = index.getAll(type);
    } else {
      request = store.getAll();
    }
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async syncWithServer(): Promise<void> {
    if (navigator.onLine) {
      try {
        // Sync progress data
        const userId = 'demo-user'; // In real app, get from auth
        const localProgress = await this.getProgress(userId);
        
        if (localProgress) {
          // Send to server
          await fetch('/api/sync/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localProgress)
          });
        }
        
        // Download latest content
        const response = await fetch('/api/sync/content');
        if (response.ok) {
          const serverContent = await response.json();
          
          // Store updated content
          for (const content of serverContent.questions || []) {
            await this.storeQuestions([content]);
          }
          
          for (const plan of serverContent.studyPlans || []) {
            await this.storeStudyPlan(plan);
          }
        }
        
        console.log('Sync completed successfully');
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async clearOfflineData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const storeNames = ['questions', 'progress', 'studyPlans', 'settings', 'content'];
    const transaction = this.db.transaction(storeNames, 'readwrite');
    
    for (const storeName of storeNames) {
      const store = transaction.objectStore(storeName);
      await store.clear();
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const offlineManager = new OfflineManager();

// Auto-sync when online
window.addEventListener('online', () => {
  offlineManager.syncWithServer();
});

// Initialize offline mode
export const initializeOfflineMode = async () => {
  try {
    await offlineManager.initialize();
    
    // Pre-populate with sample data for offline use
    const sampleQuestions = [
      {
        id: 'q1',
        category: 'Cardiology',
        difficulty: 'medium',
        question: 'A 65-year-old man presents with chest pain. What is the most appropriate initial investigation?',
        options: ['ECG', 'Chest X-ray', 'Echocardiogram', 'Cardiac catheterization'],
        correct: 0,
        explanation: 'ECG is the most appropriate initial investigation for chest pain to rule out acute coronary syndrome.'
      },
      {
        id: 'q2',
        category: 'Respiratory',
        difficulty: 'medium',
        question: 'A 45-year-old woman presents with shortness of breath. Peak flow is 200 L/min (predicted 450 L/min). What is the most likely diagnosis?',
        options: ['Asthma', 'COPD', 'Pneumonia', 'Pulmonary embolism'],
        correct: 0,
        explanation: 'Reduced peak flow with shortness of breath in a middle-aged woman suggests asthma exacerbation.'
      },
      {
        id: 'q3',
        category: 'Gastroenterology',
        difficulty: 'hard',
        question: 'A 30-year-old man presents with recurrent abdominal pain and diarrhea. Colonoscopy shows skip lesions. What is the most likely diagnosis?',
        options: ['Ulcerative colitis', 'Crohn\'s disease', 'IBS', 'Coeliac disease'],
        correct: 1,
        explanation: 'Skip lesions on colonoscopy are characteristic of Crohn\'s disease, not ulcerative colitis.'
      }
    ];
    
    await offlineManager.storeQuestions(sampleQuestions);
    
    // Store sample study plan
    const samplePlan = {
      id: 'plan1',
      title: 'PLAB 1 Preparation',
      duration: '12 weeks',
      sessions: [
        { week: 1, topic: 'Cardiology Basics', duration: '2 hours' },
        { week: 2, topic: 'Respiratory System', duration: '2 hours' },
        { week: 3, topic: 'Gastroenterology', duration: '2 hours' }
      ]
    };
    
    await offlineManager.storeStudyPlan(samplePlan);
    
    console.log('Offline mode initialized successfully');
  } catch (error) {
    console.error('Failed to initialize offline mode:', error);
  }
};

export default offlineManager;