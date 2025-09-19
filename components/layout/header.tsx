"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart, Stethoscope, Search } from "lucide-react"

// Add debounce utility function
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 500) // 500ms debounce

  // Add this function to handle search
  const handleGlobalSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    try {
      // Determine search type based on query pattern or let user select
      let response;
      if (query.startsWith('NAM-')) {
        response = await api.searchNamaste(query);
      } else if (query.match(/^[A-Za-z]{2}\d+/)) {
        response = await api.searchIcd(query);
      } else {
        response = await api.searchPatient(query);
      }
      
      const results = await response.json();
      // Update state with results - you'll need to add state for this
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false)
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      handleGlobalSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, handleGlobalSearch])

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground absolute animate-pulse" />
                <Stethoscope className="h-6 w-6 text-primary-foreground/80 transform rotate-12" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-bold text-2xl text-foreground group-hover:text-primary transition-colors duration-300">
                AyuSync
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider">HEALTHCARE BRIDGE</span>
            </div>
          </Link>

          {/* Search Input */}
          <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients, NAM- IDs, ICD codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50 backdrop-blur-sm"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-all duration-300 relative group font-medium"
            >
              Features
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="#demo"
              className="text-muted-foreground hover:text-primary transition-all duration-300 relative group font-medium"
            >
              Demo
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="#benefits"
              className="text-muted-foreground hover:text-primary transition-all duration-300 relative group font-medium"
            >
              Benefits
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Link
              href="#team"
              className="text-muted-foreground hover:text-primary transition-all duration-300 relative group font-medium"
            >
              Team
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 bg-transparent font-medium px-6"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group font-medium px-6"
              asChild
            >
              <Link href="/signup">
                Get Started
                <Heart className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden hover:bg-muted/50 p-3 rounded-xl transition-all duration-300 hover:scale-110"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
            {/* Mobile Search Input */}
            <div className="relative mb-4 px-4">
              <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patients, NAM- IDs, ICD codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background/50 backdrop-blur-sm"
              />
              {isSearching && (
                <div className="absolute right-7 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 py-3 font-medium px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#demo"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 py-3 font-medium px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Demo
              </Link>
              <Link
                href="#benefits"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 py-3 font-medium px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </Link>
              <Link
                href="#team"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 py-3 font-medium px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Team
              </Link>
              <div className="flex flex-col space-y-3 pt-4 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 bg-transparent font-medium px-6"
                  asChild
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 font-medium"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}