"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface SearchResult {
  disorder: string
  namasteCode: string
  icd11Code: string
  confidence: number
  description: string
}

const mockResults: SearchResult[] = [
  {
    disorder: "Diabetes Mellitus",
    namasteCode: "NAM-DM-001",
    icd11Code: "5A11",
    confidence: 98,
    description: "Type 2 diabetes mellitus without complications",
  },
  {
    disorder: "Hypertension",
    namasteCode: "NAM-HTN-002",
    icd11Code: "BA00",
    confidence: 95,
    description: "Essential hypertension",
  },
  {
    disorder: "Migraine",
    namasteCode: "NAM-MIG-003",
    icd11Code: "8A80.0",
    confidence: 92,
    description: "Migraine without aura",
  },
  {
    disorder: "Asthma",
    namasteCode: "NAM-AST-004",
    icd11Code: "CA23",
    confidence: 96,
    description: "Bronchial asthma",
  },
]

export function InteractiveSearch() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredResults = mockResults.filter(
    (result) =>
      result.disorder.toLowerCase().includes(query.toLowerCase()) ||
      result.namasteCode.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    if (query.length > 0) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        setIsOpen(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
      setIsTyping(false)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selected = filteredResults[selectedIndex]
      setQuery(selected.disorder)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search disorders (e.g., diabetes, hypertension...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4 py-3 text-base border-2 border-primary/20 focus:border-primary transition-all duration-200 rounded-xl"
        />
        {isTyping && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </div>
        )}
      </div>

      {isOpen && filteredResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-2 border-primary/10 animate-in slide-in-from-top-2 duration-200">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {filteredResults.map((result, index) => (
                <div
                  key={result.namasteCode}
                  className={`p-4 border-b border-border/50 last:border-b-0 cursor-pointer transition-all duration-150 ${
                    index === selectedIndex ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    setQuery(result.disorder)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{result.disorder}</h4>
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          result.confidence >= 95
                            ? "bg-green-500"
                            : result.confidence >= 90
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">{result.confidence}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">NAMASTE Code</div>
                      <div className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-300">
                        {result.namasteCode}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2">
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">ICD-11 Code</div>
                      <div className="font-mono text-sm font-semibold text-green-800 dark:text-green-300">
                        {result.icd11Code}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">{result.description}</p>

                  <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-3 w-3 text-primary" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-muted/30 border-t">
              <p className="text-xs text-center text-muted-foreground">
                <Sparkles className="inline h-3 w-3 mr-1" />
                AI-powered mapping with real-time validation
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
