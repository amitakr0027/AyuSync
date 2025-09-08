import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      organization: "Global Health Systems",
      content:
        "AyuSync has revolutionized how we handle traditional medicine integration. The seamless mapping between NAMASTE and ICD-11 codes has improved our documentation accuracy by 40%.",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Healthcare IT Director",
      organization: "MedTech Solutions",
      content:
        "The implementation was smooth and the team support was exceptional. Our clinicians adapted quickly, and we're seeing significant improvements in coding efficiency.",
      rating: 5,
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Integrative Medicine Specialist",
      organization: "Holistic Care Center",
      content:
        "Finally, a solution that bridges traditional and modern medicine coding. AyuSync understands the nuances of both systems and makes integration effortless.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">Trusted by Healthcare Professionals</h2>
          <p className="text-lg text-muted-foreground text-balance">
            See what healthcare leaders are saying about AyuSync's impact on their organizations and patient care
            delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <div className="absolute -top-3 left-6">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Quote className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary">{testimonial.organization}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-8">Trusted by healthcare innovators worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Codes Mapped Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
