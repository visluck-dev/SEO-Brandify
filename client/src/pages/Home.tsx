import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowRight, Users, TrendingUp, ShieldCheck, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <SEO 
        title="HR Consultancy & Recruitment Services | VisLuck"
        description="VisLuck offers expert HR consultancy, manpower recruitment, HR training, process streamlining, and HR analytics solutions for growing businesses."
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 pt-16 pb-32 lg:pt-32 lg:pb-48">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                Strategic HR Solutions
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight text-primary">
                Transforming Your <span className="text-secondary">Workforce</span> Strategy
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                We empower organizations with expert recruitment, data-driven HR analytics, and comprehensive process optimization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contact-visluck">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-14 px-8 text-base rounded-full">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/hr-consultancy-services">
                  <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 text-primary h-14 px-8 text-base rounded-full group">
                    Explore Services <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full transform translate-y-20"></div>
              {/* Business meeting photo */}
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="HR consultancy and recruitment services by VisLuck"
                className="relative rounded-2xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Comprehensive HR Solutions</h2>
            <p className="text-muted-foreground text-lg">
              Tailored strategies to manage your most valuable asset - your people.
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Users,
                title: "Manpower Recruitment",
                desc: "Finding the right talent for your unique organizational culture.",
                link: "/manpower-recruitment-consultancy",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: Briefcase,
                title: "HR Training",
                desc: "Upskilling your workforce for future challenges and growth.",
                link: "/hr-training-development",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: ShieldCheck,
                title: "Process Setup",
                desc: "Streamlining policies and compliance for efficiency.",
                link: "/hr-process-streamlining",
                color: "bg-amber-100 text-amber-600"
              },
              {
                icon: TrendingUp,
                title: "HR Analytics",
                desc: "Data-driven insights to optimize performance and retention.",
                link: "/hr-analytics-solutions",
                color: "bg-purple-100 text-purple-600"
              }
            ].map((service, i) => (
              <motion.div variants={item} key={i}>
                <Link href={service.link}>
                  <div className="bg-gray-50 hover:bg-white p-8 rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300 h-full cursor-pointer group">
                    <div className={`h-12 w-12 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                    <span className="text-sm font-semibold text-primary flex items-center">
                      Learn more <ArrowRight className="ml-2 h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust/CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-7xl px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Ready to Optimize Your HR Operations?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            Join hundreds of companies that trust VisLuck for their recruitment and HR needs. Let's build a better workplace together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/contact-visluck">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white border-none shadow-xl h-14 px-8 text-lg rounded-full">
                Schedule a Consultation
              </Button>
            </Link>
            <Link href="/client-testimonials">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg rounded-full">
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
