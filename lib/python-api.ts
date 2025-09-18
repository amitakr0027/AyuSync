// lib/python-api.ts
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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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

  // Problem List
  async saveProblem(problemData: any) {
    return this.fetch(`${PYTHON_BACKEND_URL}/api/problem-list`, {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  },
};