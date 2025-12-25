import { SEO } from "@/components/SEO";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      text: "VisLuck transformed our recruitment process completely. We've hired 20+ engineers through them, and the quality is outstanding.",
      author: "Sarah J.",
      role: "CTO, FinTech Startup"
    },
    {
      text: "Their HR analytics service opened our eyes to retention issues we didn't know we had. Highly recommended.",
      author: "Michael R.",
      role: "VP of HR, Manufacturing Corp"
    },
    {
      text: "Professional, timely, and deeply knowledgeable. The training sessions they conducted received rave reviews from our staff.",
      author: "Emily W.",
      role: "Operations Manager, Retail Chain"
    },
    {
      text: "Setting up HR policies for a 200-person company is no joke. VisLuck made it seamless and compliant.",
      author: "David L.",
      role: "Founder, Logistics Firm"
    }
  ];

  return (
    <>
      <SEO 
        title="Client Testimonials | VisLuck Success Stories" 
        description="See what our clients say about VisLuck's HR consultancy and recruitment services."
      />

      <div className="bg-background min-h-screen py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Client Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We take pride in the lasting partnerships we build. Here's what our clients have to say about working with us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-border relative">
                <Quote className="h-12 w-12 text-primary/10 absolute top-8 right-8" />
                <p className="text-lg text-foreground/80 leading-relaxed mb-8 relative z-10 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xl">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-primary">{t.author}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
