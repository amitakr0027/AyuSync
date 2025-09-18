import { HeroSection } from "@/components/sections/hero-section"
import { ProblemSection } from "@/components/sections/problem-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { DemoSection } from "@/components/sections/demo-section"
import { BenefitsSection } from "@/components/sections/benefits-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { TeamSection } from "@/components/sections/team-section"
import { CtaSection } from "@/components/sections/cta-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DualCoding } from "@/components/sections/DualCoding"
import { BundleManager } from "@/components/sections/BundleManager"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <DemoSection />
        <BenefitsSection />
        <TestimonialsSection />
        <TeamSection />
        <CtaSection />
        <DualCoding />
        <BundleManager />
      </main>
      <Footer />
    </div>
  )
}
