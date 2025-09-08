import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Code, Database, CheckCircle, Sparkles } from "lucide-react"
import { InteractiveSearch } from "@/components/ui/interactive-search"
import Link from "next/link"

export function DemoSection() {
  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">See AyuSync in Action</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Experience how AyuSync seamlessly integrates traditional and modern healthcare coding in real-time with our
            interactive demonstration.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Live Interactive Demo</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Try Real-Time Code Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Search for any medical condition and see instant NAMASTE ↔ ICD-11 code mapping
              </p>
            </div>
            <InteractiveSearch />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Video/Preview */}
          <div className="relative group">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  <Button
                    size="lg"
                    className="relative z-10 rounded-full w-16 h-16 p-0 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur rounded-lg p-3 group-hover:bg-background/95 transition-all duration-300">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <span className="font-medium">Live Demo: NAMASTE to ICD-11 Mapping</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    <Code className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Steps */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4 group hover:bg-muted/30 rounded-lg p-4 -m-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  1. Search NAMASTE Code
                </h3>
                <p className="text-muted-foreground">
                  Start typing a traditional medicine term and watch intelligent auto-completion suggest relevant
                  NAMASTE codes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:bg-muted/30 rounded-lg p-4 -m-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  2. Get Mapped ICD-11
                </h3>
                <p className="text-muted-foreground">
                  Instantly receive the corresponding ICD-11 code with detailed mapping information and confidence
                  scores.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 group hover:bg-muted/30 rounded-lg p-4 -m-4 transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                  3. Add to Patient Record
                </h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate both codes into patient records with full audit trail and compliance tracking.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                asChild
              >
                <Link href="/signup">
                  Try Interactive Demo
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
