"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Copy, Trash2, BarChart3, BookOpen, Filter, Download, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Type for ICD record (matching your existing structure)
type ICDRecord = {
  id: number;
  namaste?: { code: string; display: string; system: string };
  tm2?: { code: string; display: string };
  biomedicine?: { code: string; display: string };
  frequency?: number;
  addedAt?: string;
};

export default function ICD11Page() {
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("All");
  const [problemList, setProblemList] = useState<ICDRecord[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Enhanced demo data with more realistic mappings
  const demoData: ICDRecord[] = [
    {
      id: 1,
      namaste: { code: "AYU-0001", display: "Amavata (Rheumatoid-like disorder)", system: "Ayurveda" },
      tm2: { code: "TM2.A01.1Z", display: "Inflammatory joint disorder" },
      biomedicine: { code: "FA20", display: "Rheumatoid Arthritis" },
      frequency: 145
    },
    {
      id: 2,
      namaste: { code: "AYU-2005", display: "Amlapitta (Acid reflux)", system: "Ayurveda" },
      tm2: { code: "QC43", display: "Stomach fire disturbance" },
      biomedicine: { code: "K21.0", display: "Gastro-esophageal reflux disease" },
      frequency: 201
    },
    {
      id: 3,
      namaste: { code: "AYU-3010", display: "Prameha (Diabetic condition)", system: "Ayurveda" },
      tm2: { code: "TM2.E01.2Z", display: "Metabolic disorder with polyuria" },
      biomedicine: { code: "E11.9", display: "Type 2 diabetes mellitus without complications" },
      frequency: 189
    },
    {
      id: 4,
      namaste: { code: "UNI-1001", display: "Buzm-e-Meda (Digestive disorder)", system: "Unani" },
      tm2: { code: "TM2.D01.1Z", display: "Digestive system disorder" },
      biomedicine: { code: "K59.0", display: "Constipation" },
      frequency: 67
    },
    {
      id: 5,
      namaste: { code: "SID-2001", display: "Gunmam (Skin manifestation)", system: "Siddha" },
      tm2: { code: "TM2.S01.3Z", display: "Skin disorder with inflammation" },
      biomedicine: { code: "L30.9", display: "Dermatitis, unspecified" },
      frequency: 34
    },
    {
      id: 6,
      namaste: { code: "AYU-4005", display: "Swasa (Respiratory disorder)", system: "Ayurveda" },
      tm2: { code: "TM2.R01.2Z", display: "Respiratory disorder with dyspnea" },
      biomedicine: { code: "J44.1", display: "COPD with acute exacerbation" },
      frequency: 89
    }
  ];

  // Filter results based on search and system
  const filteredResults = useMemo(() => {
    if (!search) return [];
    
    return demoData.filter(item => {
      const matchesSearch = 
        item.namaste?.display.toLowerCase().includes(search.toLowerCase()) ||
        item.tm2?.display.toLowerCase().includes(search.toLowerCase()) ||
        item.biomedicine?.display.toLowerCase().includes(search.toLowerCase()) ||
        item.namaste?.code.toLowerCase().includes(search.toLowerCase()) ||
        item.tm2?.code.toLowerCase().includes(search.toLowerCase()) ||
        item.biomedicine?.code.toLowerCase().includes(search.toLowerCase());
      
      const matchesSystem = selectedSystem === "All" || item.namaste?.system === selectedSystem;
      
      return matchesSearch && matchesSystem;
    });
  }, [search, selectedSystem]);

  // Analytics data
  const systemStats = useMemo(() => {
    const stats = demoData.reduce((acc, item) => {
      const system = item.namaste?.system || 'Unknown';
      acc[system] = (acc[system] || 0) + (item.frequency || 0);
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, []);

  const topSearched = useMemo(() => {
    return [...demoData]
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 5)
      .map(item => ({
        name: item.namaste?.display.split('(')[0].trim() || 'Unknown',
        frequency: item.frequency || 0,
        system: item.namaste?.system || 'Unknown'
      }));
  }, []);

  const handleSearch = () => {
    // Search results are automatically updated via filteredResults memo
  };

  const addToProblemList = (item: ICDRecord) => {
    if (!problemList.find(p => p.id === item.id)) {
      setProblemList(prev => [...prev, { ...item, addedAt: new Date().toLocaleString() }]);
    }
  };

  const removeFromProblemList = (id: number) => {
    setProblemList(prev => prev.filter(item => item.id !== id));
  };

  const copyToClipboard = async (item: ICDRecord, type: 'all' | 'namaste' | 'tm2' | 'biomedicine' = 'all') => {
    let textToCopy = '';
    
    switch(type) {
      case 'namaste':
        textToCopy = `${item.namaste?.code} - ${item.namaste?.display}`;
        break;
      case 'tm2':
        textToCopy = `${item.tm2?.code} - ${item.tm2?.display}`;
        break;
      case 'biomedicine':
        textToCopy = `${item.biomedicine?.code} - ${item.biomedicine?.display}`;
        break;
      default:
        textToCopy = `NAMASTE: ${item.namaste?.code} - ${item.namaste?.display}\nTM2: ${item.tm2?.code} - ${item.tm2?.display}\nBiomedicine: ${item.biomedicine?.code} - ${item.biomedicine?.display}`;
    }
    
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportProblemList = () => {
    const fhirBundle = {
      resourceType: "Bundle",
      id: "problem-list-bundle",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: problemList.map(item => ({
        resource: {
          resourceType: "Condition",
          id: `condition-${item.id}`,
          clinicalStatus: {
            coding: [{
              system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active"
            }]
          },
          code: {
            coding: [
              {
                system: "http://namaste.gov.in/terminology",
                code: item.namaste?.code,
                display: item.namaste?.display
              },
              {
                system: "http://who.int/icd/tm2",
                code: item.tm2?.code,
                display: item.tm2?.display
              },
              {
                system: "http://id.who.int/icd/release/11/mms",
                code: item.biomedicine?.code,
                display: item.biomedicine?.display
              }
            ]
          },
          recordedDate: new Date().toISOString()
        }
      }))
    };

    const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'problem-list-fhir-bundle.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ICD-11 Dual Coding</h1>
        <p className="text-muted-foreground">
          Search NAMASTE disorders and view mappings with ICD-11 TM2 and Biomedicine.
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Smart Search
          </TabsTrigger>
          <TabsTrigger value="problemList" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Problem List ({problemList.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          {/* Search Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter disorder (e.g., Amavata, Amlapitta, GERD)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Systems</SelectItem>
                    <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                    <SelectItem value="Siddha">Siddha</SelectItem>
                    <SelectItem value="Unani">Unani</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          {filteredResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Results ({filteredResults.length} found)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">NAMASTE</th>
                        <th className="text-left p-4 font-medium">ICD-11 TM2</th>
                        <th className="text-left p-4 font-medium">ICD-11 Biomedicine</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {item.namaste?.code}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item, 'namaste')}
                                  className="p-1 h-auto"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <strong className="text-sm">{item.namaste?.display}</strong>
                              <div className="text-xs text-muted-foreground">{item.namaste?.system}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {item.tm2?.code}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item, 'tm2')}
                                  className="p-1 h-auto"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-sm">{item.tm2?.display}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  {item.biomedicine?.code}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item, 'biomedicine')}
                                  className="p-1 h-auto"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="text-sm">{item.biomedicine?.display}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button
                                variant={problemList.find(p => p.id === item.id) ? "secondary" : "default"}
                                size="sm"
                                onClick={() => addToProblemList(item)}
                                disabled={!!problemList.find(p => p.id === item.id)}
                                className="flex items-center gap-1"
                              >
                                {problemList.find(p => p.id === item.id) ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    Added
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    Add
                                  </>
                                )}
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(item)}
                                className={copiedId === item.id ? "bg-green-50" : ""}
                              >
                                <Copy className="w-3 h-3" />
                                {copiedId === item.id ? "Copied!" : "Copy All"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {search && filteredResults.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No results found for "{search}"</p>
                <p className="text-sm text-muted-foreground mt-1">Try different search terms or check the system filter</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Problem List Tab */}
        <TabsContent value="problemList">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Problem List
              </CardTitle>
              {problemList.length > 0 && (
                <Button onClick={exportProblemList} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export FHIR Bundle
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {problemList.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No conditions added to problem list yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Use the search tab to add conditions.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {problemList.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <div>
                            <h4 className="font-medium mb-2">NAMASTE</h4>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-1">
                              {item.namaste?.code}
                            </Badge>
                            <p className="text-sm font-medium">{item.namaste?.display}</p>
                            <p className="text-xs text-muted-foreground">{item.namaste?.system}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">TM2</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 mb-1">
                              {item.tm2?.code}
                            </Badge>
                            <p className="text-sm">{item.tm2?.display}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">ICD-11 Biomedicine</h4>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 mb-1">
                              {item.biomedicine?.code}
                            </Badge>
                            <p className="text-sm">{item.biomedicine?.display}</p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromProblemList(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground">Added: {item.addedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Searched Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Most Searched Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topSearched}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="frequency" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Usage by Traditional System</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={systemStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {systemStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{demoData.length}</div>
                  <div className="text-sm text-muted-foreground">Total Mappings</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{problemList.length}</div>
                  <div className="text-sm text-muted-foreground">Problem List Items</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(demoData.reduce((sum, item) => sum + (item.frequency || 0), 0) / demoData.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Searches</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-muted-foreground">TM Systems</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}