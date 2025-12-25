import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Blog() {
  return (
    <>
      <SEO 
        title="HR Insights & Blog | VisLuck" 
        description="Latest trends, tips, and insights in the world of Human Resources and Recruitment."
      />

      <div className="bg-background min-h-screen py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">HR Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-16">
            Stay tuned for our latest articles on recruitment strategies, workplace culture, and HR technology.
          </p>

          <div className="max-w-xl mx-auto bg-white rounded-3xl p-12 shadow-sm border border-border">
             <div className="inline-block p-4 rounded-full bg-secondary/10 text-secondary mb-6">
               <span className="text-4xl">Coming Soon</span>
             </div>
             <p className="text-muted-foreground mb-8">
               We are currently curating high-quality content to help you navigate the HR landscape. Check back soon!
             </p>
             <Link href="/">
               <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                 Return Home
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </>
  );
}
