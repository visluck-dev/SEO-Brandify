import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Settings, BarChart3 } from "lucide-react";

const services = [
  {
    id: "recruitment",
    title: "Manpower & Recruitment",
    desc: "End-to-end recruitment solutions ranging from executive search to mass hiring.",
    icon: Users,
    link: "/manpower-recruitment-consultancy",
    features: ["Executive Search", "Permanent Staffing", "Contract Hiring"]
  },
  {
    id: "training",
    title: "HR Training & Development",
    desc: "Customized training programs to upskill your workforce and leadership.",
    icon: BookOpen,
    link: "/hr-training-development",
    features: ["Leadership Workshops", "Soft Skills Training", "Compliance Training"]
  },
  {
    id: "process",
    title: "HR Process Setup",
    desc: "Establishing robust HR policies, handbooks, and compliance frameworks.",
    icon: Settings,
    link: "/hr-process-streamlining",
    features: ["Policy Formulation", "Payroll Setup", "Performance Management"]
  },
  {
    id: "analytics",
    title: "HR Analytics",
    desc: "Leveraging data to make informed decisions about your workforce.",
    icon: BarChart3,
    link: "/hr-analytics-solutions",
    features: ["Attrition Analysis", "Productivity Metrics", "Workforce Planning"]
  }
];

export default function Services() {
  return (
    <>
      <SEO 
        title="HR Consultancy Services | VisLuck" 
        description="Explore our comprehensive HR services including recruitment, training, process setup, and analytics."
      />

      <div className="bg-background py-20">
        <div className="container mx-auto max-w-7xl px-4 text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We offer a full spectrum of HR solutions designed to help your business thrive in a competitive landscape.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border hover:shadow-xl transition-all duration-300 group">
                <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 text-lg">{service.desc}</p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                      <div className="h-1.5 w-1.5 rounded-full bg-secondary"></div>
                      {f}
                    </div>
                  ))}
                </div>

                <Link href={service.link}>
                  <Button variant="outline" className="w-full justify-between group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
