import { SEO } from "@/components/SEO";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <>
      <SEO 
        title="About VisLuck HR Consultancy | Mission & Vision" 
        description="Learn about VisLuck's history, mission, and vision. We are dedicated to providing top-tier HR consultancy and recruitment services."
      />
      
      <div className="bg-background min-h-screen">
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">About VisLuck</h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Your trusted partner in navigating the complex landscape of Human Resources and Talent Acquisition.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-primary">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Founded with a vision to transform how businesses handle their most critical asset—people—VisLuck has grown into a premier HR consultancy firm. We believe that efficient HR practices are the backbone of any successful organization.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Our team comprises industry veterans who bring decades of experience in recruitment, compliance, training, and analytics. We don't just fill positions; we build teams that drive growth.
                </p>
              </div>
              <div>
                {/* Office team working */}
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="VisLuck Team Collaboration" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                <h3 className="text-2xl font-display font-bold mb-6 text-primary">Our Mission</h3>
                <p className="text-muted-foreground mb-6">
                  To provide innovative, data-driven, and human-centric HR solutions that empower organizations to achieve their strategic goals while fostering a positive workplace culture.
                </p>
                <ul className="space-y-3">
                  {['Integrity in every action', 'Excellence in delivery', 'Client-centric approach'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="text-secondary h-5 w-5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-10 rounded-3xl border border-gray-100">
                <h3 className="text-2xl font-display font-bold mb-6 text-primary">Our Vision</h3>
                <p className="text-muted-foreground mb-6">
                  To be the global benchmark for HR consultancy, recognized for our ability to unlock human potential and drive business transformation through strategic people management.
                </p>
                <ul className="space-y-3">
                  {['Global standards', 'Continuous innovation', 'Sustainable growth'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="text-secondary h-5 w-5" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
