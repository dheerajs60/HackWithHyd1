import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ArrowUpRight,
  Key,
  FileCode2,
  Zap
} from 'lucide-react';

const activityData = [
  {
    id: 1,
    type: 'deployment',
    title: 'Smart Contract Deployed',
    description: 'ERC-721 NFT Collection on Ethereum',
    time: '2 minutes ago',
    status: 'success',
    icon: FileCode2,
    network: 'Ethereum'
  },
  {
    id: 2,
    type: 'api_call',
    title: 'API Key Generated',
    description: 'Production key with full permissions',
    time: '1 hour ago',
    status: 'success',
    icon: Key,
    network: null
  },
  {
    id: 3,
    type: 'transaction',
    title: 'Gasless Transaction',
    description: 'Token transfer executed successfully',
    time: '3 hours ago',
    status: 'success',
    icon: Zap,
    network: 'Polygon'
  },
  {
    id: 4,
    type: 'api_call',
    title: 'High API Usage',
    description: '80% of monthly limit reached',
    time: '5 hours ago',
    status: 'warning',
    icon: Activity,
    network: null
  },
  {
    id: 5,
    type: 'deployment',
    title: 'Contract Verification',
    description: 'Source code verified on Etherscan',
    time: '1 day ago',
    status: 'success',
    icon: CheckCircle,
    network: 'Ethereum'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-web3-success';
    case 'warning':
      return 'text-web3-warning';
    case 'error':
      return 'text-web3-error';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge className="bg-web3-success/20 text-web3-success border-web3-success/30">Success</Badge>;
    case 'warning':
      return <Badge className="bg-web3-warning/20 text-web3-warning border-web3-warning/30">Warning</Badge>;
    case 'error':
      return <Badge className="bg-web3-error/20 text-web3-error border-web3-error/30">Error</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

export const RecentActivity = () => {
  return (
    <Card className="gradient-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        <Badge variant="outline" className="text-xs">
          Live <div className="w-2 h-2 bg-web3-success rounded-full ml-1 animate-pulse" />
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {activityData.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className={`p-2 rounded-full bg-muted/50 ${getStatusColor(activity.status)}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <div className="flex items-center space-x-2">
                  {activity.network && (
                    <Badge variant="outline" className="text-xs">
                      {activity.network}
                    </Badge>
                  )}
                  {getStatusBadge(activity.status)}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
              
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
            
            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        
        <div className="text-center pt-4">
          <button className="text-sm text-web3-primary hover:text-web3-primary-light transition-colors">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};