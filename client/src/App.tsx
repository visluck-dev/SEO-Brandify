import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import ManpowerRecruitment from "@/pages/ManpowerRecruitment";
import HRTraining from "@/pages/HRTraining";
import HRProcessSetup from "@/pages/HRProcessSetup";
import HRAnalytics from "@/pages/HRAnalytics";
import Testimonials from "@/pages/Testimonials";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about-visluck-hr-consultancy" component={About} />
        <Route path="/hr-consultancy-services" component={Services} />
        <Route path="/manpower-recruitment-consultancy" component={ManpowerRecruitment} />
        <Route path="/hr-training-development" component={HRTraining} />
        <Route path="/hr-process-streamlining" component={HRProcessSetup} />
        <Route path="/hr-analytics-solutions" component={HRAnalytics} />
        <Route path="/client-testimonials" component={Testimonials} />
        <Route path="/careers" component={Careers} />
        <Route path="/contact-visluck" component={Contact} />
        <Route path="/hr-insights" component={Blog} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
