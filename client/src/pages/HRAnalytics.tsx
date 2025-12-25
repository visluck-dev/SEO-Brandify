import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BarChart, PieChart, LineChart, Activity } from "lucide-react";

export default function HRAnalytics() {
  return (
    <>
      <SEO 
        title="HR Analytics & Workforce Optimization | VisLuck" 
        description="Data-driven HR analytics solutions to improve performance, reduce attrition, and optimize workforce planning."
      />

      <div className="bg-background min-h-screen">
        <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/40 mb-6">
              <Activity className="h-4 w-4" /> Data-Driven Decisions
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">HR Analytics Solutions</h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Turn your HR data into actionable insights. Move beyond intuition and start predicting workforce trends.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-border/50">
                <BarChart className="h-10 w-10 text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4 text-primary">Attrition Analysis</h3>
                <p className="text-muted-foreground">Understand why people leave and predict who might leave next. Implement retention strategies that work.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-border/50">
                <PieChart className="h-10 w-10 text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4 text-primary">Performance Metrics</h3>
                <p className="text-muted-foreground">Link individual performance to business outcomes. Identify top performers and skills gaps.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-border/50">
                <LineChart className="h-10 w-10 text-secondary mb-6" />
                <h3 className="text-xl font-bold mb-4 text-primary">Workforce Planning</h3>
                <p className="text-muted-foreground">Forecast future talent needs based on business growth projections and market trends.</p>
              </div>
            </div>

            <div className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold mb-6">Unlock the Power of Your Data</h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
                  Ready to transform your HR function from operational to strategic? Our analytics consultants are here to help.
                </p>
                <Link href="/contact-visluck">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 font-semibold">
                    Get a Demo
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
