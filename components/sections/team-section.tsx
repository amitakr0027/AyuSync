import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Github, Mail } from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "Dr. Amit Sharma",
      role: "Co-Founder & CEO",
      bio: "Healthcare technology veteran with 15+ years in medical informatics and traditional medicine integration.",
      image: "/professional-headshot-of-indian-male-doctor-in-sui.jpg",
      linkedin: "#",
      github: "#",
      email: "amit@ayusync.com",
    },
    {
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      bio: "Former Google Health engineer specializing in healthcare data standards and interoperability solutions.",
      image: "/professional-headshot-of-indian-female-tech-execut.jpg",
      linkedin: "#",
      github: "#",
      email: "priya@ayusync.com",
    },
    {
      name: "Dr. Michael Chen",
      role: "Chief Medical Advisor",
      bio: "WHO consultant and ICD-11 implementation expert with extensive experience in global health standards.",
      image: "/professional-headshot-of-asian-male-doctor-with-gl.jpg",
      linkedin: "#",
      github: "#",
      email: "michael@ayusync.com",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Product",
      bio: "Product strategist with deep expertise in healthcare UX and clinical workflow optimization.",
      image: "/professional-headshot-of-blonde-female-product-man.jpg",
      linkedin: "#",
      github: "#",
      email: "sarah@ayusync.com",
    },
  ]

  return (
    <section id="team" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6">Meet Our Expert Team</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Our diverse team combines deep healthcare expertise with cutting-edge technology to deliver innovative
            solutions for global health interoperability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>

                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.github}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
