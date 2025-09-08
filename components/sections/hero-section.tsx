import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles, Heart, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 gradient-animate" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full glass-effect px-6 py-3 text-sm font-medium mb-8 mt-8 hover:scale-105 transition-all duration-500 cursor-default group shadow-lg">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary group-hover:animate-spin" />
              <span className="text-primary font-semibold">Revolutionizing Healthcare</span>
              <Heart className="h-4 w-4 text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-balance mb-8 leading-tight">
            <span className="text-foreground">AyuSync</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default inline-block">
              Healthcare Bridge
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground text-balance mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Seamlessly integrate <span className="text-primary font-semibold">NAMASTE</span> &{" "}
            <span className="text-primary font-semibold">ICD-11</span> codes into digital health systems.
            <br className="hidden sm:block" />
            Experience unified healthcare coding that bridges ancient wisdom with modern medicine.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              size="lg"
              className="text-lg px-10 py-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group font-semibold rounded-2xl"
              asChild
            >
              <Link href="/signup">
                <Zap className="mr-3 h-5 w-5 group-hover:animate-pulse" />
                Try Demo Now
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-4 glass-effect hover:bg-primary/10 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group font-semibold rounded-2xl bg-transparent"
            >
              <Play className="mr-3 h-5 w-5 group-hover:scale-125 transition-transform duration-300" />
              Watch Demo
            </Button>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-8 font-medium">Trusted by healthcare innovators worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="flex items-center space-x-3 hover:scale-110 transition-all duration-300 cursor-default group glass-effect px-4 py-3 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <span className="text-sm font-bold text-primary-foreground">WHO</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">ICD-11</div>
                  <div className="text-xs text-muted-foreground">Compatible</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 hover:scale-110 transition-all duration-300 cursor-default group glass-effect px-4 py-3 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">FHIR</div>
                  <div className="text-xs text-muted-foreground">Standards</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 hover:scale-110 transition-all duration-300 cursor-default group glass-effect px-4 py-3 rounded-xl">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <span className="text-sm font-bold text-primary-foreground">ABHA</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-foreground">Ready</div>
                  <div className="text-xs text-muted-foreground">Integration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-10 animate-bounce delay-1000">
        <div className="w-4 h-4 bg-primary/30 rounded-full blur-sm"></div>
      </div>
      <div className="absolute top-40 right-20 animate-bounce delay-2000">
        <div className="w-6 h-6 bg-secondary/30 rounded-full blur-sm"></div>
      </div>
      <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
        <div className="w-5 h-5 bg-accent/30 rounded-full blur-sm"></div>
      </div>
    </section>
  )
}
