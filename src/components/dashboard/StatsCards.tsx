import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  FolderOpen, 
  Key, 
  Activity, 
  TrendingUp, 
  Server,
  Zap,
  Globe
} from 'lucide-react';

interface StatsCardsProps {
  profile: any;
  projects: any[];
  apiKeys: any[];
}

export const StatsCards = ({ profile, projects, apiKeys }: StatsCardsProps) => {
  const statsData = [
    {
      title: 'Credits Remaining',
      value: profile?.credits?.toLocaleString() || '0',
      icon: CreditCard,
      color: 'text-web3-primary',
      change: '+2.5%',
      changeType: 'positive'
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.is_active).length.toString(),
      icon: FolderOpen,
      color: 'text-web3-success',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'API Keys',
      value: apiKeys.filter(k => k.is_active).length.toString(),
      icon: Key,
      color: 'text-web3-accent',
      change: '2 new',
      changeType: 'neutral'
    },
    {
      title: 'Monthly Usage',
      value: profile?.monthly_usage?.toLocaleString() || '0',
      icon: Activity,
      color: 'text-web3-warning',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Success Rate',
      value: '99.9%',
      icon: TrendingUp,
      color: 'text-web3-success',
      change: '+0.1%',
      changeType: 'positive'
    },
    {
      title: 'Response Time',
      value: '156ms',
      icon: Zap,
      color: 'text-web3-accent',
      change: '-23ms',
      changeType: 'positive'
    },
    {
      title: 'Networks',
      value: '12',
      icon: Globe,
      color: 'text-web3-primary',
      change: '+2 new',
      changeType: 'positive'
    },
    {
      title: 'Uptime',
      value: '99.99%',
      icon: Server,
      color: 'text-web3-success',
      change: 'Excellent',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.title}
                </p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};