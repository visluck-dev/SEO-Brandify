import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HRTraining() {
  return (
    <>
      <SEO 
        title="HR Training & Development Programs | VisLuck" 
        description="Professional HR training programs including payroll, compliance, leadership, and employee development by VisLuck HR experts."
      />

      <div className="bg-background">
        <div className="bg-gradient-to-r from-secondary/90 to-secondary text-white py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">HR Training & Development</h1>
            <p className="text-xl opacity-90 max-w-2xl leading-relaxed">
              Empower your team with the skills they need to excel in a dynamic business environment.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-20">
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               {
                 title: "Leadership Development",
                 desc: "Programs designed to groom the next generation of leaders in your organization."
               },
               {
                 title: "Soft Skills Training",
                 desc: "Enhancing communication, teamwork, and emotional intelligence for better collaboration."
               },
               {
                 title: "Compliance & Ethics",
                 desc: "Ensuring your workforce understands legal requirements and company ethics."
               },
               {
                 title: "Technical HR Skills",
                 desc: "Workshops on payroll processing, recruitment tools, and HR software."
               },
               {
                 title: "Performance Management",
                 desc: "Training managers on how to conduct effective reviews and give feedback."
               },
               {
                 title: "Employee Wellness",
                 desc: "Workshops focused on mental health, stress management, and work-life balance."
               }
             ].map((program, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-border hover:shadow-lg transition-all">
                 <h3 className="text-xl font-bold mb-4 text-primary">{program.title}</h3>
                 <p className="text-muted-foreground">{program.desc}</p>
               </div>
             ))}
           </div>

           <div className="mt-16 text-center bg-gray-50 p-12 rounded-3xl border border-gray-100">
             <h2 className="text-3xl font-display font-bold mb-6 text-primary">Customized Corporate Training</h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
               We don't believe in one-size-fits-all. We analyze your team's specific gaps and design bespoke training modules.
             </p>
             <Link href="/contact-visluck">
               <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8">
                 Request a Training Proposal
               </Button>
             </Link>
           </div>
        </div>
      </div>
    </>
  );
}
