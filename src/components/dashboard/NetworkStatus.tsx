import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

const networks = [
  {
    name: 'Ethereum',
    status: 'online',
    latency: '156ms',
    uptime: 99.9,
    gasPrice: '23 gwei',
    blockHeight: '18,425,891',
    load: 85
  },
  {
    name: 'Polygon',
    status: 'online',
    latency: '89ms',
    uptime: 99.8,
    gasPrice: '2.1 gwei',
    blockHeight: '49,238,442',
    load: 62
  },
  {
    name: 'BSC',
    status: 'online',
    latency: '124ms',
    uptime: 99.7,
    gasPrice: '3 gwei',
    blockHeight: '33,456,789',
    load: 73
  },
  {
    name: 'Arbitrum',
    status: 'degraded',
    latency: '234ms',
    uptime: 98.5,
    gasPrice: '0.1 gwei',
    blockHeight: '142,567,832',
    load: 94
  },
  {
    name: 'Optimism',
    status: 'online',
    latency: '145ms',
    uptime: 99.6,
    gasPrice: '0.05 gwei',
    blockHeight: '112,345,677',
    load: 58
  },
  {
    name: 'Avalanche',
    status: 'maintenance',
    latency: '---',
    uptime: 0,
    gasPrice: '---',
    blockHeight: '36,789,123',
    load: 0
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <Wifi className="w-4 h-4 text-web3-success" />;
    case 'degraded':
      return <AlertTriangle className="w-4 h-4 text-web3-warning" />;
    case 'maintenance':
      return <WifiOff className="w-4 h-4 text-web3-error" />;
    default:
      return <WifiOff className="w-4 h-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-web3-success/20 text-web3-success border-web3-success/30">Online</Badge>;
    case 'degraded':
      return <Badge className="bg-web3-warning/20 text-web3-warning border-web3-warning/30">Degraded</Badge>;
    case 'maintenance':
      return <Badge className="bg-web3-error/20 text-web3-error border-web3-error/30">Maintenance</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getLoadColor = (load: number) => {
  if (load >= 90) return 'text-web3-error';
  if (load >= 70) return 'text-web3-warning';
  return 'text-web3-success';
};

export const NetworkStatus = () => {
  const onlineNetworks = networks.filter(n => n.status === 'online').length;
  const totalNetworks = networks.length;

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Network Status</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Activity className="w-4 h-4 mr-1" />
            {onlineNetworks}/{totalNetworks} Online
          </div>
          <div className="w-2 h-2 bg-web3-success rounded-full animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {networks.map((network, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(network.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">{network.name}</p>
                  {getStatusBadge(network.status)}
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                  <span>Latency: {network.latency}</span>
                  <span>Gas: {network.gasPrice}</span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-muted-foreground">Load:</span>
                <span className={`text-xs font-medium ${getLoadColor(network.load)}`}>
                  {network.load}%
                </span>
              </div>
              <Progress 
                value={network.load} 
                className="w-20 h-1"
              />
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 border-t border-border/50">
          <button className="text-sm text-web3-primary hover:text-web3-primary-light transition-colors">
            View detailed network stats →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};