"use client"

import { useState, useCallback } from "react"
import { debounce } from "lodash"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Save, LinkIcon, CheckCircle } from "lucide-react"

// Mock API functions - replace with your actual API calls
const api = {
  searchNamaste: async (query: string) => {
    // Simulate API call
    return Promise.resolve({
      json: async () => [
        { id: 1, code: 'NAM-001', description: 'Chronic headache disorders' },
        { id: 2, code: 'NAM-002', description: 'Hypertension management' },
        { id: 3, code: 'NAM-003', description: 'Diabetes mellitus type 2' },
      ]
    })
  },
  searchIcd: async (query: string) => {
    // Simulate API call
    return Promise.resolve({
      json: async () => [
        { id: 1, code: 'G43', description: 'Migraine' },
        { id: 2, code: 'I10', description: 'Essential hypertension' },
        { id: 3, code: 'E11', description: 'Type 2 diabetes mellitus' },
      ]
    })
  },
  saveProblem: async (data: any) => {
    // Simulate API call
    console.log('Saving:', data)
    return Promise.resolve({ ok: true })
  }
}

interface CodeResult {
  id: number
  code: string
  description: string
}

export function DualCoding() {
  const [namasteQuery, setNamasteQuery] = useState("")
  const [icdQuery, setIcdQuery] = useState("")
  const [namasteResults, setNamasteResults] = useState<CodeResult[]>([])
  const [icdResults, setIcdResults] = useState<CodeResult[]>([])
  const [selectedNamaste, setSelectedNamaste] = useState<CodeResult | null>(null)
  const [selectedIcd, setSelectedIcd] = useState<CodeResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Search handlers with debouncing
  const handleNamasteSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setNamasteResults([])
        return
      }
      try {
        const response = await api.searchNamaste(query)
        const data = await response.json()
        setNamasteResults(data)
      } catch (error) {
        console.error('Namaste search error:', error)
        setNamasteResults([])
      }
    }, 300),
    []
  )

  const handleIcdSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setIcdResults([])
        return
      }
      try {
        const response = await api.searchIcd(query)
        const data = await response.json()
        setIcdResults(data)
      } catch (error) {
        console.error('ICD search error:', error)
        setIcdResults([])
      }
    }, 300),
    []
  )

  // Save handler
  const handleSaveCodes = async () => {
    if (!selectedNamaste || !selectedIcd) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      const response = await api.saveProblem({
        patientId: "current-patient-id", // You'll need to get this from context or props
        namasteCode: selectedNamaste.code,
        icdCodes: [selectedIcd.code]
      })
      
      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">Dual Coding Workspace</h2>
        <p className="text-muted-foreground mt-2">
          Search and link NAMASTE codes with corresponding ICD codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NAMASTE Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              NAMASTE Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search NAMASTE codes..."
              value={namasteQuery}
              onChange={(e) => {
                setNamasteQuery(e.target.value)
                handleNamasteSearch(e.target.value)
              }}
            />
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {namasteResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedNamaste?.id === result.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedNamaste(result)}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono">
                      {result.code}
                    </Badge>
                    {selectedNamaste?.id === result.id && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.description}
                  </p>
                </div>
              ))}
              
              {namasteQuery && namasteResults.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No results found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ICD Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              ICD Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search ICD codes..."
              value={icdQuery}
              onChange={(e) => {
                setIcdQuery(e.target.value)
                handleIcdSearch(e.target.value)
              }}
            />
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {icdResults.map((result) => (
                <div
                  key={result.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedIcd?.id === result.id
                      ? 'bg-primary/10 border-primary'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedIcd(result)}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="font-mono">
                      {result.code}
                    </Badge>
                    {selectedIcd?.id === result.id && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.description}
                  </p>
                </div>
              ))}
              
              {icdQuery && icdResults.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No results found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selection Summary and Save */}
      {(selectedNamaste || selectedIcd) && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {selectedNamaste && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">NAMASTE Code</h4>
                  <Badge variant="secondary" className="font-mono mt-1">
                    {selectedNamaste.code}
                  </Badge>
                  <p className="text-sm mt-1">{selectedNamaste.description}</p>
                </div>
              )}
              
              {selectedIcd && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold">ICD Code</h4>
                  <Badge variant="secondary" className="font-mono mt-1">
                    {selectedIcd.code}
                  </Badge>
                  <p className="text-sm mt-1">{selectedIcd.description}</p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleSaveCodes}
              disabled={!selectedNamaste || !selectedIcd || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>Saving...</>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Link & Save Codes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}