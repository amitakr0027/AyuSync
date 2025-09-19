// components/DualCodingWorkspace.tsx - UPDATED
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Layers, Plus, RefreshCw, Zap, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { pythonApi, apiUtils } from '@/lib/python-api';

interface Coding {
  code: string;
  display: string;
  system?: string;
  category?: string;
  module?: string;
}

interface MappingSuggestion {
  code: string;
  display: string;
  module: string;
  confidence: number;
  mappingType: string;
}

interface DualCodingState {
  namasteQuery: string;
  icdQuery: string;
  namasteResults: Coding[];
  icdResults: Coding[];
  selectedNamaste: Coding | null;
  selectedIcd: Coding | null;
  loading: boolean;
  saveLoading: boolean;
  mappingSuggestions: MappingSuggestion[];
  showSuggestions: boolean;
  error: string | null;
  success: string | null;
}

export default function DualCodingWorkspace() {
  const [state, setState] = useState<DualCodingState>({
    namasteQuery: '',
    icdQuery: '',
    namasteResults: [],
    icdResults: [],
    selectedNamaste: null,
    selectedIcd: null,
    loading: false,
    saveLoading: false,
    mappingSuggestions: [],
    showSuggestions: false,
    error: null,
    success: null,
  });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (state.error || state.success) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, error: null, success: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error, state.success]);

  // Search NAMASTE codes
  const searchNamaste = async (query: string) => {
    if (query.length < 2) {
      setState(prev => ({ ...prev, namasteResults: [] }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await pythonApi.searchNamaste(query);
      setState(prev => ({ ...prev, namasteResults: data }));
    } catch (error) {
      console.error('NAMASTE search failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Search failed. Please check if backend is running.',
        namasteResults: [] 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Search ICD codes
  const searchIcd = async (query: string) => {
    if (query.length < 2) {
      setState(prev => ({ ...prev, icdResults: [] }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await pythonApi.searchIcd(query);
      setState(prev => ({ ...prev, icdResults: data }));
    } catch (error) {
      console.error('ICD search failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'ICD search failed. Using fallback results.',
        icdResults: [] 
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Get mapping suggestions when NAMASTE code is selected
  const fetchMappingSuggestions = async (namasteCode: string) => {
    try {
      const suggestions = await pythonApi.getConceptMap(namasteCode);
      setState(prev => ({
        ...prev,
        mappingSuggestions: suggestions,
        showSuggestions: suggestions.length > 0,
        error: suggestions.length === 0 ? 'No automatic mappings found for this code.' : null
      }));
    } catch (error) {
      console.error('Failed to fetch mapping suggestions:', error);
      setState(prev => ({
        ...prev,
        mappingSuggestions: [],
        showSuggestions: false,
        error: 'Could not load automatic mappings.'
      }));
    }
  };

  // Handle NAMASTE code selection
  const handleNamasteSelect = (item: Coding) => {
    setState(prev => ({
      ...prev,
      selectedNamaste: item,
      icdQuery: '',
      icdResults: [],
      selectedIcd: null,
      showSuggestions: false,
      mappingSuggestions: [],
      error: null,
      success: null
    }));
    
    // Fetch automatic mappings
    fetchMappingSuggestions(item.code);
  };

  // Apply a mapping suggestion
  const applySuggestion = (suggestion: MappingSuggestion) => {
    setState(prev => ({
      ...prev,
      selectedIcd: {
        code: suggestion.code,
        display: suggestion.display,
        module: suggestion.module,
        system: suggestion.module.includes('TM2') 
          ? "http://id.who.int/icd/entity" 
          : "http://id.who.int/icd/release/11/mms"
      },
      showSuggestions: false,
      success: 'Automatic mapping applied successfully!'
    }));
  };

  // Replace the saveDualCoding function in DualCodingWorkspace.tsx
const saveDualCoding = async () => {
  if (!state.selectedNamaste || !state.selectedIcd) {
    setState(prev => ({ ...prev, error: 'Please select both a NAMASTE code and an ICD-11 code' }));
    return;
  }

  setState(prev => ({ ...prev, saveLoading: true, error: null }));
  try {
    // Use the correct API endpoint and format
    const response = await fetch('http://localhost:8000/api/problem-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: 'demo-patient-001',
        namasteCode: state.selectedNamaste.code,
        icdCodes: [state.selectedIcd.code]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const result = await response.json();
    
    setState(prev => ({
      ...prev,
      success: 'Dual coding saved successfully!',
      selectedNamaste: null,
      selectedIcd: null,
      namasteQuery: '',
      icdQuery: '',
      namasteResults: [],
      icdResults: [],
      mappingSuggestions: [],
      showSuggestions: false
    }));
    
    console.log('Save result:', result);
  } catch (error) {
    console.error('Save failed:', error);
    setState(prev => ({ 
      ...prev, 
      error: error instanceof Error ? error.message : 'Failed to save. Please try again.' 
    }));
  } finally {
    setState(prev => ({ ...prev, saveLoading: false }));
  }
};

  // Debounced search effects
  useEffect(() => {
    const timer = setTimeout(() => {
      searchNamaste(state.namasteQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.namasteQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchIcd(state.icdQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.icdQuery]);

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{state.error}</p>
        </div>
      )}
      
      {state.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-green-800">{state.success}</p>
        </div>
      )}

      <Card>
        <CardHeader>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NAMASTE Search Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">NAMASTE Terminology</h3>
                <Badge variant="outline">AYUSH</Badge>
              </div>
              
              <Input
                placeholder="Search NAMASTE codes (e.g., Vata, Pitta)..."
                value={state.namasteQuery}
                onChange={(e) => setState(prev => ({ ...prev, namasteQuery: e.target.value }))}
                disabled={state.loading}
              />
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.namasteResults.map((item) => (
                  <div
                    key={item.code}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      state.selectedNamaste?.code === item.code
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/20'
                        : 'bg-muted/50 hover:bg-muted border-border'
                    }`}
                    onClick={() => handleNamasteSelect(item)}
                  >
                    <div className="font-medium">{item.display}</div>
                    <div className="text-sm text-muted-foreground flex justify-between items-center">
                      <span>{item.code}</span>
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {state.namasteQuery.length > 1 && state.namasteResults.length === 0 && !state.loading && (
                  <div className="p-3 text-center text-muted-foreground italic">
                    No NAMASTE codes found for "{state.namasteQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* ICD-11 Search Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-secondary" />
                <h3 className="font-semibold">ICD-11 Mappings</h3>
                <Badge variant="outline">TM2 + Biomed</Badge>
              </div>
              
              <Input
                placeholder="Search ICD-11 codes or use auto-mapping below..."
                value={state.icdQuery}
                onChange={(e) => setState(prev => ({ ...prev, icdQuery: e.target.value }))}
                disabled={state.loading || !state.selectedNamaste}
              />

              {/* Automatic Mapping Suggestions */}
              {state.showSuggestions && state.mappingSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                      <Zap className="h-4 w-4" /> 
                      Automatic Mapping Suggestions
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setState(prev => ({ ...prev, showSuggestions: false }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {state.mappingSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => applySuggestion(suggestion)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{suggestion.display}</div>
                            <div className="text-sm text-muted-foreground">{suggestion.code}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {suggestion.module}
                            </Badge>
                          </div>
                          <div className="text-right ml-2">
                            <div className={apiUtils.getConfidenceColor(suggestion.confidence)}>
                              {suggestion.confidence}% match
                            </div>
                            <Badge 
                              variant={apiUtils.getConfidenceBadge(suggestion.confidence)} 
                              className="text-xs mt-1"
                            >
                              {suggestion.mappingType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-blue-600 flex items-center gap-1">
                    💡 <span>Select a suggestion or search manually above</span>
                  </div>
                </div>
              )}

              {/* Manual ICD Search Results */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.icdResults.map((item) => (
                  <div
                    key={item.code}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      state.selectedIcd?.code === item.code
                        ? 'bg-secondary/10 border-secondary ring-2 ring-secondary/20'
                        : 'bg-muted/50 hover:bg-muted border-border'
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedIcd: item }))}
                  >
                    <div className="font-medium">{item.display}</div>
                    <div className="text-sm text-muted-foreground flex justify-between items-center">
                      <span>{item.code}</span>
                      {item.module && (
                        <Badge variant="outline" className="text-xs">
                          {item.module}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                
                {state.icdQuery.length > 1 && state.icdResults.length === 0 && !state.loading && (
                  <div className="p-3 text-center text-muted-foreground italic">
                    No ICD codes found for "{state.icdQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {(state.selectedNamaste || state.selectedIcd) && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold mb-3">Selected Codes</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">NAMASTE Code</div>
                  {state.selectedNamaste ? (
                    <div className="p-3 bg-primary/5 rounded-md border border-primary/20">
                      <div className="font-medium">{state.selectedNamaste.display}</div>
                      <div className="text-sm text-muted-foreground">{state.selectedNamaste.code}</div>
                      {state.selectedNamaste.category && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {state.selectedNamaste.category}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 text-muted-foreground italic bg-muted/30 rounded-md">
                      No NAMASTE code selected
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">ICD-11 Code</div>
                  {state.selectedIcd ? (
                    <div className="p-3 bg-secondary/5 rounded-md border border-secondary/20">
                      <div className="font-medium">{state.selectedIcd.display}</div>
                      <div className="text-sm text-muted-foreground">{state.selectedIcd.code}</div>
                      {state.selectedIcd.module && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {state.selectedIcd.module}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 text-muted-foreground italic bg-muted/30 rounded-md">
                      No ICD code selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={saveDualCoding}
            disabled={!state.selectedNamaste || !state.selectedIcd || state.saveLoading}
            className="w-full"
            size="lg"
          >
            {state.saveLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                Saving to Database...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> 
                Save Both Codes to Problem List
              </>
            )}
          </Button>

          {/* Loading Indicator */}
          {state.loading && (
            <div className="text-center text-muted-foreground flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}