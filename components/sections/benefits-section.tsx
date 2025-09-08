import { Card, CardContent } from "@/components/ui/card"
import { Users, Building, CreditCard, TrendingUp } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Users,
      title: "For Clinicians",
      description:
        "Faster, accurate documentation with intelligent code suggestions and seamless workflow integration.",
      features: ["Reduced coding time", "Improved accuracy", "Streamlined workflows", "Better patient care"],
    },
    {
      icon: Building,
      title: "For Hospitals",
      description: "Standards compliance & interoperability with existing systems and global healthcare networks.",
      features: ["FHIR compliance", "Easy integration", "Data standardization", "Global compatibility"],
    },
    {
      icon: CreditCard,
      title: "For Insurance",
      description: "ICD-11 coding for smooth claims processing and accurate reimbursement calculations.",
      features: ["Faster claims", "Reduced errors", "Better analytics", "Cost optimization"],
    },
    {
      icon: TrendingUp,
      title: "For Policy Makers",
      description: "Reliable national health data for informed decision-making and public health initiatives.",
      features: ["Data insights", "Trend analysis", "Policy support", "Health monitoring"],
    },
  ]

  return (
    <section id="benefits" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">
            Benefits for Every Healthcare Stakeholder
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            AyuSync delivers value across the entire healthcare ecosystem, from individual practitioners to large
            healthcare organizations and policy makers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{benefit.description}</p>
                    <ul className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
