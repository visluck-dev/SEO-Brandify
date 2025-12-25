import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Success", description: "Thank you for contacting VisLuck. We will get back to you shortly." });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 500);
  };

  return (
    <>
      <SEO 
        title="Contact VisLuck HR Consultancy | Get Expert HR Support" 
        description="Contact VisLuck HR Consultancy for recruitment, HR training, analytics, and process setup."
      />
      <div className="bg-background min-h-screen">
        <div className="bg-primary text-white py-20">
          <div className="container mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90">We're here to help you build a better workforce.</p>
          </div>
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-primary mb-6">Get In Touch</h2>
                <p className="text-muted-foreground text-lg mb-8">Our team is ready to answer all your questions.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg text-secondary"><MapPin className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-bold text-foreground">Our Location</h3>
                    <p className="text-muted-foreground">123 Business Park, Suite 400<br/>New York, NY 10001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg text-secondary"><Mail className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-bold text-foreground">Email Us</h3>
                    <p className="text-muted-foreground">info@visluck.com | contact@visluck.com | careers@visluck.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg text-secondary"><Phone className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-bold text-foreground">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg text-secondary"><Clock className="h-6 w-6" /></div>
                  <div>
                    <h3 className="font-bold text-foreground">Working Hours</h3>
                    <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-border">
              <h2 className="text-2xl font-display font-bold text-primary mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 bg-gray-50" data-testid="input-name" />
                  <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 bg-gray-50" data-testid="input-email" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input placeholder="Phone (Optional)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="h-12 bg-gray-50" data-testid="input-phone" />
                  <Input placeholder="Subject (Optional)" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="h-12 bg-gray-50" data-testid="input-subject" />
                </div>
                <Textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="min-h-[150px] bg-gray-50 resize-none" data-testid="textarea-message" />
                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-lg" disabled={loading} data-testid="button-submit">
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
