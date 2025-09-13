import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/web3-hero.jpg";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      {/* Hero content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-card/50 border border-border px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-web3-success" />
              <span className="text-sm text-muted-foreground">Enterprise-Grade Infrastructure</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Deploy{" "}
                <span className="web3-text-gradient">Web3 Apps</span>{" "}
                Across{" "}
                <span className="web3-text-gradient">50+ Chains</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Democratize Web3 development with enterprise-grade infrastructure, 
                unified APIs, and gasless transactions. Build, deploy, and scale 
                in minutes, not months.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGetStarted} size="lg" className="bg-web3-primary hover:bg-web3-primary-light shadow-glow group">
                {user ? 'Go to Dashboard' : 'Start Building Free'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-border hover:bg-card/50">
                <Code className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-web3-primary">50+</div>
                <div className="text-sm text-muted-foreground">Blockchains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-web3-secondary">99.99%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-web3-accent">10,000</div>
                <div className="text-sm text-muted-foreground">TPS</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Hero image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={heroImage} 
                alt="Web3 BaaS Platform Dashboard" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-web3-success/20 backdrop-blur-sm border border-web3-success/30 rounded-xl p-4 shadow-neon">
              <Zap className="w-6 h-6 text-web3-success" />
              <div className="text-sm font-medium mt-2">Gasless Transactions</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-web3-primary/20 backdrop-blur-sm border border-web3-primary/30 rounded-xl p-4 shadow-glow">
              <Code className="w-6 h-6 text-web3-primary" />
              <div className="text-sm font-medium mt-2">One-Click Deploy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;