import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Key, 
  FileCode2, 
  Zap, 
  BookOpen, 
  BarChart3,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const quickActions = [
  {
    title: 'Create Project',
    description: 'Start a new Web3 project',
    icon: Plus,
    color: 'bg-web3-primary hover:bg-web3-primary-light',
    href: '/dashboard/projects/new'
  },
  {
    title: 'Generate API Key',
    description: 'Create new API credentials',
    icon: Key,
    color: 'bg-web3-accent hover:bg-web3-accent/80',
    href: '/dashboard/api-keys/new'
  },
  {
    title: 'Deploy Contract',
    description: 'Deploy smart contracts',
    icon: FileCode2,
    color: 'bg-web3-success hover:bg-web3-success/80',
    href: '/dashboard/contracts/deploy'
  },
  {
    title: 'Gasless TX',
    description: 'Send gasless transactions',
    icon: Zap,
    color: 'bg-web3-warning hover:bg-web3-warning/80',
    href: '/dashboard/gasless'
  }
];

const resourceLinks = [
  {
    title: 'API Documentation',
    description: 'Comprehensive API reference',
    icon: BookOpen,
    href: '/dashboard/docs'
  },
  {
    title: 'Analytics Dashboard',
    description: 'View detailed usage metrics',
    icon: BarChart3,
    href: '/dashboard/analytics'
  },
  {
    title: 'Getting Started',
    description: 'Quick setup guide',
    icon: Sparkles,
    href: '/dashboard/getting-started'
  }
];

export const QuickActions = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-24 flex-col space-y-2 ${action.color} border-0 text-white hover:text-white hover:shadow-glow transition-all duration-300`}
            >
              <action.icon className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resourceLinks.map((resource, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-web3-primary/20">
                  <resource.icon className="w-4 h-4 text-web3-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{resource.title}</p>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-web3-primary transition-colors" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};