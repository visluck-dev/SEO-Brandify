import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HRProcessSetup() {
  return (
    <>
      <SEO 
        title="HR Process Setup & Streamlining Services | VisLuck" 
        description="End-to-end HR process setup, payroll, compliance, and policy development to streamline HR operations for your organization."
      />

      <div className="bg-background">
        <section className="bg-primary text-white py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">HR Process Optimization</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Building the structural foundation for your organization's growth.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1">
                 {/* Blueprint/Process image */}
                 <img 
                   src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                   alt="Strategic HR Planning" 
                   className="rounded-2xl shadow-2xl"
                 />
               </div>
               <div className="order-1 lg:order-2 space-y-8">
                 <h2 className="text-3xl font-display font-bold text-primary">From Chaos to Clarity</h2>
                 <p className="text-muted-foreground text-lg">
                   Many growing businesses struggle with ad-hoc HR practices. We step in to formalize and streamline your processes, ensuring consistency and scalability.
                 </p>
                 
                 <div className="space-y-4">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                     <h3 className="font-bold text-lg mb-2 text-primary">Policy Formulation</h3>
                     <p className="text-muted-foreground">Creating employee handbooks, code of conduct, and operational policies tailored to your industry.</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                     <h3 className="font-bold text-lg mb-2 text-primary">Onboarding & Offboarding</h3>
                     <p className="text-muted-foreground">Designing structured entry and exit processes to enhance employee experience and protect company assets.</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
                     <h3 className="font-bold text-lg mb-2 text-primary">Payroll & Compliance</h3>
                     <p className="text-muted-foreground">Setting up compliant payroll systems and ensuring adherence to local labor laws.</p>
                   </div>
                 </div>

                 <Link href="/contact-visluck">
                   <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                     Audit My Processes
                   </Button>
                 </Link>
               </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
