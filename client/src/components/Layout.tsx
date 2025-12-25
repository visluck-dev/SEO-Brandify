import { Link, useLocation } from "wouter";
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Twitter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-visluck-hr-consultancy", label: "About" },
    { href: "/hr-consultancy-services", label: "Services" },
    { href: "/hr-analytics-solutions", label: "Analytics" },
    { href: "/client-testimonials", label: "Testimonials" },
    { href: "/careers", label: "Careers" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 px-4 hidden md:block">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> +1 (555) 123-4567</span>
            <span className="flex items-center gap-2"><Mail className="h-3 w-3" /> info@visluck.com</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-secondary transition-colors"><Linkedin className="h-3 w-3" /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Facebook className="h-3 w-3" /></a>
            <a href="#" className="hover:text-secondary transition-colors"><Twitter className="h-3 w-3" /></a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-display font-bold text-xl shadow-lg">
              V
            </div>
            <span className="font-display font-bold text-2xl text-primary tracking-tight">VisLuck</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative group py-2",
                  isActive(link.href) ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                  isActive(link.href) && "scale-x-100"
                )}/>
              </Link>
            ))}
            <Link href="/contact-visluck">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Contact Us
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden border-t bg-background p-4 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "text-base font-medium px-4 py-2 rounded-md hover:bg-muted transition-colors",
                    isActive(link.href) ? "bg-primary/5 text-primary" : "text-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact-visluck" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90">Contact Us</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground pt-16 pb-8">
        <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-white text-primary rounded-md flex items-center justify-center font-display font-bold text-lg">V</div>
              <span className="font-display font-bold text-xl text-white">VisLuck</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your strategic partner in HR excellence. We help organizations build, manage, and optimize their workforce for sustainable growth.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-secondary">Services</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/manpower-recruitment-consultancy" className="hover:text-white transition-colors">Recruitment & Staffing</Link></li>
              <li><Link href="/hr-training-development" className="hover:text-white transition-colors">Training & Development</Link></li>
              <li><Link href="/hr-process-streamlining" className="hover:text-white transition-colors">HR Process Setup</Link></li>
              <li><Link href="/hr-analytics-solutions" className="hover:text-white transition-colors">HR Analytics</Link></li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-secondary">Company</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/about-visluck-hr-consultancy" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/client-testimonials" className="hover:text-white transition-colors">Testimonials</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact-visluck" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/hr-insights" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-secondary">Contact</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span>123 Business Park, Suite 400<br/>New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <span>contact@visluck.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 mt-16 pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} VisLuck HR Consultancy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
