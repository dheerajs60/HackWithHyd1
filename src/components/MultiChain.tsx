import multiChainImage from "@/assets/multi-chain.jpg";
import { Badge } from "@/components/ui/badge";

const blockchains = [
  { name: "Ethereum", symbol: "ETH", status: "Active" },
  { name: "Polygon", symbol: "MATIC", status: "Active" },
  { name: "Binance Smart Chain", symbol: "BSC", status: "Active" },
  { name: "Avalanche", symbol: "AVAX", status: "Active" },
  { name: "Solana", symbol: "SOL", status: "Active" },
  { name: "Arbitrum", symbol: "ARB", status: "Active" },
  { name: "Optimism", symbol: "OP", status: "Active" },
  { name: "Fantom", symbol: "FTM", status: "Active" },
  { name: "Cronos", symbol: "CRO", status: "Active" },
  { name: "Harmony", symbol: "ONE", status: "Active" },
  { name: "Celo", symbol: "CELO", status: "Active" },
  { name: "Moonbeam", symbol: "GLMR", status: "Active" },
  { name: "Near Protocol", symbol: "NEAR", status: "Active" },
  { name: "Cosmos", symbol: "ATOM", status: "Active" },
  { name: "Polkadot", symbol: "DOT", status: "Beta" },
  { name: "Cardano", symbol: "ADA", status: "Beta" },
];

const stats = [
  { label: "Total Networks", value: "50+", description: "Blockchain networks supported" },
  { label: "Response Time", value: "<200ms", description: "Average API response time" },
  { label: "Requests/Min", value: "Unlimited", description: "Enterprise rate limits" },
  { label: "Global Regions", value: "15+", description: "Worldwide infrastructure" },
];

const MultiChain = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Unified Access to{" "}
                <span className="web3-text-gradient">50+ Blockchains</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Single API interface for all major blockchain networks. 
                Deploy once, run everywhere with automatic chain detection 
                and intelligent routing.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-2xl font-bold text-web3-primary">{stat.value}</div>
                  <div className="text-sm font-medium">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </div>
              ))}
            </div>
            
            {/* Blockchain list */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supported Networks</h3>
              <div className="flex flex-wrap gap-2">
                {blockchains.slice(0, 12).map((blockchain, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-card/50 border border-border hover:border-web3-primary/30 transition-colors"
                  >
                    {blockchain.name}
                    {blockchain.status === "Beta" && (
                      <span className="ml-2 text-xs bg-web3-warning/20 text-web3-warning px-1 rounded">
                        Beta
                      </span>
                    )}
                  </Badge>
                ))}
                <Badge variant="outline" className="border-web3-primary/30 text-web3-primary">
                  +38 More
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Right content - Multi-chain visualization */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={multiChainImage} 
                alt="Multi-Chain Network Visualization" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating network indicators */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-web3-success/20 backdrop-blur-sm border border-web3-success/30 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-web3-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium">All Networks Online</span>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3">
              <div className="text-sm font-medium">Cross-Chain Transactions</div>
              <div className="text-2xl font-bold text-web3-primary">2,847,392</div>
              <div className="text-xs text-muted-foreground">Last 24 hours</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MultiChain;