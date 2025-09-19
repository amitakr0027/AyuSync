// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, FileText, Map, AlertCircle, CheckCircle } from "lucide-react";

interface ProblemRecord {
  id: number;
  patient_id: string;
  namaste_code: string;
  namaste_display?: string;
  icd_code: string;
  icd_display?: string;
  created_at: number;
}

interface ConceptMapRecord {
  id: number;
  namaste_code: string;
  namaste_display?: string;
  icd_code: string;
  icd_display: string;
  module: string;
  confidence: number;
  mapping_type: string;
}

interface NamasteRecord {
  code: string;
  display: string;
  category: string;
  system: string;
}

export default function AdminPage() {
  const [problems, setProblems] = useState<ProblemRecord[]>([]);
  const [conceptMaps, setConceptMaps] = useState<ConceptMapRecord[]>([]);
  const [namasteCodes, setNamasteCodes] = useState<NamasteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('problems');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'problems') {
        const response = await fetch('http://localhost:8000/api/debug/problems');
        if (!response.ok) throw new Error('Failed to fetch problems');
        const data = await response.json();
        setProblems(data);
      } else if (activeTab === 'concept-map') {
        const response = await fetch('http://localhost:8000/api/debug/concept-map');
        if (!response.ok) throw new Error('Failed to fetch concept maps');
        const data = await response.json();
        setConceptMaps(data);
      } else if (activeTab === 'namaste') {
        const response = await fetch('http://localhost:8000/api/debug/namaste');
        if (!response.ok) throw new Error('Failed to fetch NAMASTE codes');
        const data = await response.json();
        setNamasteCodes(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Database Admin Panel</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b pb-4">
        <Button
          variant={activeTab === 'problems' ? 'default' : 'outline'}
          onClick={() => setActiveTab('problems')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Saved Problems
        </Button>
        <Button
          variant={activeTab === 'concept-map' ? 'default' : 'outline'}
          onClick={() => setActiveTab('concept-map')}
          className="flex items-center gap-2"
        >
          <Map className="h-4 w-4" />
          Concept Mappings
        </Button>
        <Button
          variant={activeTab === 'namaste' ? 'default' : 'outline'}
          onClick={() => setActiveTab('namaste')}
          className="flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          NAMASTE Codes
        </Button>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {activeTab === 'problems' && 'Saved Problems'}
          {activeTab === 'concept-map' && 'Concept Mappings'}
          {activeTab === 'namaste' && 'NAMASTE Codes'}
        </h2>
        <Button onClick={fetchData} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p>Loading data...</p>
        </div>
      )}

      {/* Problems Table */}
      {!loading && activeTab === 'problems' && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Dual Coding Mappings</CardTitle>
            <CardDescription>
              These are the problems that users have saved through the dual coding interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            {problems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No problems saved yet.</p>
                <p className="text-sm">Save some mappings in the dual coding workspace to see them here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Patient ID</th>
                      <th className="px-4 py-2 text-left">NAMASTE Code</th>
                      <th className="px-4 py-2 text-left">ICD Code</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">{problem.id}</td>
                        <td className="px-4 py-2">
                          <Badge variant="outline">{problem.patient_id}</Badge>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{problem.namaste_display || problem.namaste_code}</div>
                          <div className="text-sm text-muted-foreground">{problem.namaste_code}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{problem.icd_display || problem.icd_code}</div>
                          <div className="text-sm text-muted-foreground">{problem.icd_code}</div>
                        </td>
                        <td className="px-4 py-2 text-sm">{formatDate(problem.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Concept Mappings Table */}
      {!loading && activeTab === 'concept-map' && (
        <Card>
          <CardHeader>
            <CardTitle>Concept Mappings Database</CardTitle>
            <CardDescription>
              Pre-defined mappings between NAMASTE codes and ICD-11 codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conceptMaps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No concept mappings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">NAMASTE Code</th>
                      <th className="px-4 py-2 text-left">ICD Code</th>
                      <th className="px-4 py-2 text-left">Module</th>
                      <th className="px-4 py-2 text-left">Confidence</th>
                      <th className="px-4 py-2 text-left">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conceptMaps.map((map) => (
                      <tr key={map.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2">
                          <div className="font-medium">{map.namaste_display}</div>
                          <div className="text-sm text-muted-foreground">{map.namaste_code}</div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{map.icd_display}</div>
                          <div className="text-sm text-muted-foreground">{map.icd_code}</div>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant="outline">{map.module}</Badge>
                        </td>
                        <td className={`px-4 py-2 font-semibold ${getConfidenceColor(map.confidence)}`}>
                          {map.confidence}%
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant="secondary">{map.mapping_type}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NAMASTE Codes Table */}
      {!loading && activeTab === 'namaste' && (
        <Card>
          <CardHeader>
            <CardTitle>NAMASTE Codes Database</CardTitle>
            <CardDescription>
              All NAMASTE codes available in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {namasteCodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No NAMASTE codes found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">Display Name</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">System</th>
                    </tr>
                  </thead>
                  <tbody>
                    {namasteCodes.map((item) => (
                      <tr key={item.code} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-2 font-mono">{item.code}</td>
                        <td className="px-4 py-2 font-medium">{item.display}</td>
                        <td className="px-4 py-2">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="px-4 py-2 text-sm text-muted-foreground">{item.system}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{problems.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Problems</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Map className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{conceptMaps.length}</p>
                  <p className="text-sm text-muted-foreground">Concept Mappings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{namasteCodes.length}</p>
                  <p className="text-sm text-muted-foreground">NAMASTE Codes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}