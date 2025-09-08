import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone, Sparkles, CheckCircle } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Experience the Future of{" "}
            <span className="text-primary hover:text-primary/80 transition-colors duration-300 cursor-default">
              Integrated Healthcare Coding
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Join healthcare organizations worldwide who are already transforming their coding workflows with AyuSync's
            innovative platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="text-base px-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              asChild
            >
              <Link href="/signup">
                <span className="relative z-10">Request Access</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 bg-transparent hover:bg-primary/5 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              asChild
            >
              <Link href="/signup?intent=demo">
                Schedule Demo
                <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
              </Link>
            </Button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer group">
              <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>contact@ayusync.com</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer group">
              <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>

          {/* Additional Trust Elements */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Ready to transform your healthcare coding workflow?</p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1 hover:text-primary transition-colors duration-200 cursor-default group">
                <CheckCircle className="h-3 w-3 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Free 30-day trial</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-primary transition-colors duration-200 cursor-default group">
                <CheckCircle className="h-3 w-3 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <span>No setup fees</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-primary transition-colors duration-200 cursor-default group">
                <CheckCircle className="h-3 w-3 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <span>24/7 support</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-primary transition-colors duration-200 cursor-default group">
                <CheckCircle className="h-3 w-3 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                <span>HIPAA compliant</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
