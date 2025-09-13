import { 
  Globe, 
  Zap, 
  Code, 
  Database, 
  Shield, 
  BarChart3, 
  GitBranch, 
  Bot,
  Cloud,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Unified API for 50+ blockchain networks with consistent request/response formats",
    highlight: "50+ Networks"
  },
  {
    icon: Code,
    title: "Smart Contract Deployment",
    description: "One-click deployment across multiple chains with automated gas optimization",
    highlight: "<5 Minutes"
  },
  {
    icon: Zap,
    title: "Gasless Transactions",
    description: "Meta-transaction infrastructure eliminates gas fees for better UX",
    highlight: "10,000 TPS"
  },
  {
    icon: Bot,
    title: "Serverless Workflows",
    description: "Automate blockchain events and complex DeFi strategies with visual builder",
    highlight: "99.9% Uptime"
  },
  {
    icon: Database,
    title: "Decentralized Storage",
    description: "IPFS integration with global CDN for lightning-fast content delivery",
    highlight: "100+ Edges"
  },
  {
    icon: Shield,
    title: "Enterprise Nodes",
    description: "High-availability blockchain infrastructure with enterprise SLA",
    highlight: "99.99% SLA"
  },
  {
    icon: BarChart3,
    title: "Analytics Suite",
    description: "Real-time monitoring with custom dashboards and intelligent alerts",
    highlight: "Real-Time"
  },
  {
    icon: Search,
    title: "Data Querying",
    description: "SQL-like querying of blockchain data with GraphQL interface",
    highlight: "<5s Queries"
  },
  {
    icon: GitBranch,
    title: "Developer Tools",
    description: "Comprehensive SDKs, testing tools, and interactive documentation",
    highlight: "4 Languages"
  },
  {
    icon: Cloud,
    title: "AI Assessment",
    description: "Hands-on learning platform with AI-driven feedback and certification",
    highlight: ">90% Accuracy"
  }
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to Build{" "}
            <span className="web3-text-gradient">Web3 at Scale</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Complete infrastructure stack with enterprise-grade reliability 
            and developer-friendly tools for rapid Web3 development.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group gradient-card border-border/50 hover:border-web3-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto bg-web3-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-web3-primary/20 transition-colors">
                      <Icon className="w-8 h-8 text-web3-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-web3-success text-background text-xs font-bold px-2 py-1 rounded-full">
                      {feature.highlight}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;