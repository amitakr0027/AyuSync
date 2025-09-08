import { AlertTriangle, Globe, Stethoscope, Heart } from "lucide-react"

export function ProblemSection() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Fragmented Records",
      description: "Traditional medicine records remain scattered across different systems without standardization.",
    },
    {
      icon: Globe,
      title: "Interoperability Gap",
      description: "Global healthcare demands ICD-11 compliance for seamless data exchange.",
    },
    {
      icon: Stethoscope,
      title: "Complex Integration",
      description: "Clinicians need a unified, simple coding solution that bridges both worlds.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">The Healthcare Integration Challenge</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Healthcare systems worldwide struggle with fragmented data and incompatible coding standards, creating
            barriers to effective patient care and global health initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <problem.icon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Solution Flow */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="flex-1 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl">🔀</span>
              </div>
              <h4 className="font-semibold text-accent">Fragmented</h4>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center relative">
                <Heart className="h-4 w-4 text-primary-foreground absolute" fill="currentColor" />
                <Stethoscope className="h-3 w-3 text-primary-foreground/80 absolute translate-x-1 translate-y-1" />
              </div>
              <div className="hidden md:block w-16 h-0.5 bg-primary ml-2"></div>
            </div>

            <div className="flex-1 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="font-semibold text-primary">Unified</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
