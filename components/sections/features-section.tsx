import { Card, CardContent } from "@/components/ui/card"
import { Search, Link, Shield, BarChart, Globe, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Auto-complete NAMASTE & ICD-11 terms with intelligent matching and suggestions.",
    },
    {
      icon: Link,
      title: "Dual Coding",
      description: "Store both traditional & biomedical codes together for comprehensive patient records.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "OAuth 2.0, FHIR standards, and ABHA-ready integration for maximum security.",
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Live morbidity trends & reporting for data-driven healthcare decisions.",
    },
    {
      icon: Globe,
      title: "Global Ready",
      description: "ICD-11 TM2 & Biomedicine integration for worldwide healthcare interoperability.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for high-volume healthcare environments and real-time usage.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">Powerful Features for Modern Healthcare</h2>
          <p className="text-lg text-muted-foreground text-balance">
            AyuSync combines cutting-edge technology with healthcare expertise to deliver a comprehensive coding
            solution that works seamlessly across all medical systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 hover:-translate-y-2 cursor-default"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 group-hover:rotate-3">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors duration-200" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-200">
                  {feature.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-0.5 bg-primary/30 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
