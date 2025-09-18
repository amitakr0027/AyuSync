// services/python-api.ts
import { API_CONFIG } from '@/lib/api-config';

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
    return this.fetch(`${API_CONFIG.ENDPOINTS.NAMASTE_SEARCH}?q=${encodeURIComponent(query)}`);
  },

  async searchIcd(query: string) {
    return this.fetch(`${API_CONFIG.ENDPOINTS.ICD_SEARCH}?q=${encodeURIComponent(query)}`);
  },

  async searchPatient(abhaId: string) {
    return this.fetch(`${API_CONFIG.ENDPOINTS.PATIENT_SEARCH}?abha=${encodeURIComponent(abhaId)}`);
  },

  // Problem List
  async saveProblem(problemData: any) {
    return this.fetch(API_CONFIG.ENDPOINTS.PROBLEM_LIST, {
      method: 'POST',
      body: JSON.stringify(problemData),
    });
  },

  // Bundle Operations
  async uploadBundle(formData: FormData) {
    // For file uploads, let the browser set Content-Type
    const response = await fetch(API_CONFIG.ENDPOINTS.BUNDLE_UPLOAD, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async validateBundle(bundleData: any) {
    return this.fetch(API_CONFIG.ENDPOINTS.BUNDLE_VALIDATE, {
      method: 'POST',
      body: JSON.stringify(bundleData),
    });
  },

  async exportBundle(bundleId: string) {
    return this.fetch(`${API_CONFIG.ENDPOINTS.BUNDLE_EXPORT}?id=${bundleId}`);
  },

  // System
  async getRecentLogs() {
    return this.fetch(API_CONFIG.ENDPOINTS.LOGS);
  },

  async getSyncStatus() {
    return this.fetch(API_CONFIG.ENDPOINTS.SYNC_STATUS);
  },
};