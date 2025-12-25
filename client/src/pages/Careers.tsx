import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Careers() {
  return (
    <>
      <SEO 
        title="Careers at VisLuck | Join Our Team" 
        description="Join the team of HR experts at VisLuck. View current job openings and apply today."
      />

      <div className="bg-background min-h-screen py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Join Team VisLuck</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            We are always looking for passionate HR professionals, recruiters, and data analysts to join our growing family.
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-border p-12">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-primary">No Open Positions Currently</h2>
              <p className="text-muted-foreground">
                We don't have any specific openings right now, but we'd still love to hear from you. 
                Send your resume to our careers email, and we'll keep it on file for future opportunities.
              </p>
              <div className="pt-4">
                <a href="mailto:careers@visluck.com">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                    Email Resume to careers@visluck.com
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
