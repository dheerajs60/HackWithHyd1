import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  Users, 
  Headphones, 
  Award,
  Lock,
  Globe,
  Zap
} from "lucide-react";

const enterprises = [
  "Coinbase", "Binance", "Uniswap", "Aave", "Compound", 
  "MakerDAO", "OpenSea", "Chainlink", "Polygon", "Avalanche"
];

const features = [
  {
    icon: Shield,
    title: "99.99% Uptime SLA",
    description: "Enterprise-grade reliability with automatic failover"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Dedicated support team with <1 hour response time"
  },
  {
    icon: Lock,
    title: "SOC 2 Compliant",
    description: "Bank-level security with end-to-end encryption"
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "15+ regions worldwide with low-latency access"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Role-based access control and audit logging"
  },
  {
    icon: Zap,
    title: "Custom SLAs",
    description: "Tailored performance guarantees for your needs"
  }
];

const metrics = [
  { label: "Fortune 500 Companies", value: "250+", description: "Trust our infrastructure" },
  { label: "API Requests", value: "10B+", description: "Processed monthly" },
  { label: "Transactions", value: "$50B+", description: "Value processed" },
  { label: "Developers", value: "50K+", description: "Building with us" },
];

const Enterprise = () => {
  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle opacity-30" />
      
      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-web3-primary/10 text-web3-primary border-web3-primary/20">
            <Award className="w-4 h-4 mr-2" />
            Enterprise Ready
          </Badge>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Trusted by{" "}
            <span className="web3-text-gradient">250+ Fortune 500</span>{" "}
            Companies
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Enterprise-grade Web3 infrastructure with bank-level security, 
            dedicated support, and custom SLAs for mission-critical applications.
          </p>
        </div>
        
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-60">
          {enterprises.map((company, index) => (
            <div key={index} className="text-lg font-semibold text-muted-foreground">
              {company}
            </div>
          ))}
        </div>
        
        {/* Metrics */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <Card key={index} className="gradient-card border-border/50 text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-web3-primary mb-2">{metric.value}</div>
                <div className="text-sm font-medium mb-1">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Enterprise features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group gradient-card border-border/50 hover:border-web3-primary/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-web3-primary/10 rounded-xl flex items-center justify-center group-hover:bg-web3-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-web3-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Card className="inline-block gradient-card border-web3-primary/30 shadow-glow">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3">Ready for Enterprise?</h3>
                  <p className="text-muted-foreground">
                    Get custom pricing, dedicated support, and enterprise SLAs.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-web3-primary hover:bg-web3-primary-light shadow-glow">
                    <Headphones className="w-5 h-5 mr-2" />
                    Contact Sales
                  </Button>
                  
                  <Button variant="outline" size="lg" className="border-border hover:bg-card/50">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Overview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Enterprise;