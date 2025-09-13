import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Terminal, Book, Github, PlayCircle } from "lucide-react";
import developerToolsImage from "@/assets/developer-tools.jpg";

const sdks = [
  { name: "JavaScript", icon: "JS", color: "bg-yellow-500" },
  { name: "Python", icon: "PY", color: "bg-blue-500" },
  { name: "Go", icon: "GO", color: "bg-cyan-500" },
  { name: "Rust", icon: "RS", color: "bg-orange-500" },
];

const codeExample = `// Deploy smart contract across multiple chains
import { Web3BaaS } from '@web3baas/sdk';

const baas = new Web3BaaS({ apiKey: 'your-api-key' });

// Deploy to 5 chains simultaneously
const deployment = await baas.contracts.deploy({
  contract: 'MyToken.sol',
  chains: ['ethereum', 'polygon', 'bsc', 'avalanche', 'arbitrum'],
  gasOptimization: true,
  verify: true
});

console.log('Deployed to:', deployment.addresses);
// Output: { ethereum: '0x123...', polygon: '0x456...', ... }`;

const DeveloperTools = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content - Developer tools image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={developerToolsImage} 
                alt="Developer Tools and Code Environment" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
            
            {/* Floating code snippet */}
            <Card className="absolute -bottom-6 -right-6 w-80 gradient-card border-border/50 shadow-glow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Terminal className="w-4 h-4 text-web3-success" />
                  <span className="text-sm font-medium">Quick Deploy</span>
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </div>
                <pre className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded overflow-x-auto">
                  <code>{codeExample.split('\n').slice(0, 8).join('\n')}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
          
          {/* Right content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Developer-First{" "}
                <span className="web3-text-gradient">Tools & SDKs</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Comprehensive development toolkit with interactive documentation, 
                code examples, and SDKs in your favorite programming language.
              </p>
            </div>
            
            {/* SDK Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available SDKs</h3>
              <div className="flex space-x-4">
                {sdks.map((sdk, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-card/50 border border-border rounded-lg px-4 py-3">
                    <div className={`w-8 h-8 ${sdk.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>
                      {sdk.icon}
                    </div>
                    <span className="font-medium">{sdk.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Developer Experience</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Code className="w-5 h-5 text-web3-primary" />
                  <span className="text-sm">Interactive Docs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PlayCircle className="w-5 h-5 text-web3-success" />
                  <span className="text-sm">Live Examples</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Terminal className="w-5 h-5 text-web3-accent" />
                  <span className="text-sm">Testing Suite</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5 text-web3-primary" />
                  <span className="text-sm">Open Source</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-web3-primary hover:bg-web3-primary-light shadow-glow">
                <Book className="w-5 h-5 mr-2" />
                Explore Documentation
              </Button>
              
              <Button variant="outline" size="lg" className="border-border hover:bg-card/50">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperTools;