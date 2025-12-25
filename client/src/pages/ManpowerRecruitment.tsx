import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ManpowerRecruitment() {
  return (
    <>
      <SEO 
        title="Manpower & Recruitment Consultancy Services | VisLuck" 
        description="Hire the right talent with VisLuck’s manpower and recruitment consultancy services. Permanent, contract, and executive hiring solutions."
      />

      <div className="bg-background">
        <div className="bg-primary text-white py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Manpower & Recruitment</h1>
            <p className="text-xl opacity-90 max-w-2xl leading-relaxed">
              We connect you with top-tier talent that aligns with your company culture and strategic goals.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold mb-6 text-primary">Permanent Staffing Solutions</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Finding long-term employees is an investment. We employ rigorous screening processes to ensure candidates not only have the right skills but also fit your organizational culture.
                </p>
                <ul className="space-y-3">
                  {['In-depth candidate screening', 'Cultural fit assessment', 'Background verification'].map(item => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="text-secondary h-5 w-5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-display font-bold mb-6 text-primary">Executive Search</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Our executive search practice focuses on identifying leadership talent that can drive business transformation. We handle these sensitive searches with utmost confidentiality.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-display font-bold mb-6 text-primary">Contract & Temporary Staffing</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Need flexibility? Our contract staffing solutions allow you to scale your workforce up or down based on project demands without the long-term commitment.
                </p>
              </div>

              <div className="pt-8">
                <Link href="/contact-visluck">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                    Start Hiring
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24">
                {/* Handshake image */}
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Professional recruitment interview" 
                  className="rounded-2xl shadow-2xl mb-8"
                />
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-border">
                  <h3 className="font-bold text-xl mb-4 text-primary">Why Choose Us?</h3>
                  <p className="text-muted-foreground mb-4">
                    "VisLuck reduced our hiring time by 40% and improved our candidate quality significantly."
                  </p>
                  <p className="font-bold text-sm">— HR Director, Tech Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
