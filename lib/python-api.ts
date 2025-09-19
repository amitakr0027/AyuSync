// lib/python-api.ts - UPDATED
const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://localhost:8000";

export const pythonApi = {
  // Generic fetch helper
  async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API error: ${response.status} ${response.statusText}`
      );
    }
    
    return response.json();
  },

  // Search APIs
  async searchNamaste(query: string) {
    return this.fetch(`${PYTHON_BACKEND_URL}/api/namaste/search?q=${encodeURIComponent(query)}`);
  },

  async searchIcd(query: string) {
    return this.fetch(`${PYTHON_BACKEND_URL}/api/icd/search?q=${encodeURIComponent(query)}`);
  },

  // Problem List - Save dual coding
  async saveProblem(problemData: any) {
    return this.fetch(`${PYTHON_BACKEND_URL}/api/problem-list`, {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  },

  // Concept mapping
  async getConceptMap(namasteCode: string) {
    return this.fetch(`${PYTHON_BACKEND_URL}/api/concept-map/${encodeURIComponent(namasteCode)}`);
  },
};

// Additional utility functions
export const apiUtils = {
  // Extract ICD module from code
  getIcdModule(code: string): string {
    if (code.startsWith('TM2')) return 'TM2';
    if (code.startsWith('5A') || code.startsWith('1B') || code.startsWith('BA')) return 'Biomedical';
    if (code.startsWith('K') || code.startsWith('L') || code.startsWith('J')) return 'Biomedical';
    return 'Unknown';
  },
  
  // Get confidence color
  getConfidenceColor(confidence: number): string {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  },
  
  // Get confidence badge variant
  getConfidenceBadge(confidence: number): 'default' | 'secondary' | 'destructive' {
    if (confidence >= 85) return 'default';
    if (confidence >= 70) return 'secondary';
    return 'destructive';
  }
};