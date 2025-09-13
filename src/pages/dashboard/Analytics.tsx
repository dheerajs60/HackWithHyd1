import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const mockApiData = [
  { date: '2024-01', calls: 12400, success: 98.2, avgResponse: 245 },
  { date: '2024-02', calls: 15600, success: 97.8, avgResponse: 250 },
  { date: '2024-03', calls: 18200, success: 98.5, avgResponse: 235 },
  { date: '2024-04', calls: 21800, success: 98.9, avgResponse: 220 },
  { date: '2024-05', calls: 25400, success: 97.9, avgResponse: 240 },
  { date: '2024-06', calls: 28900, success: 98.4, avgResponse: 230 }
];

const mockNetworkData = [
  { name: 'Ethereum', value: 45, color: '#627EEA' },
  { name: 'Polygon', value: 25, color: '#8247E5' },
  { name: 'BSC', value: 15, color: '#F3BA2F' },
  { name: 'Avalanche', value: 10, color: '#E84142' },
  { name: 'Arbitrum', value: 5, color: '#28A0F0' }
];

const mockEndpointData = [
  { endpoint: '/api/v1/balance', calls: 45000, percentage: 35 },
  { endpoint: '/api/v1/transaction', calls: 32000, percentage: 25 },
  { endpoint: '/api/v1/contract/deploy', calls: 25000, percentage: 20 },
  { endpoint: '/api/v1/nft/mint', calls: 15000, percentage: 12 },
  { endpoint: '/api/v1/analytics', calls: 10000, percentage: 8 }
];

const mockRealtimeData = [
  { time: '00:00', requests: 120, errors: 2 },
  { time: '00:15', requests: 135, errors: 1 },
  { time: '00:30', requests: 150, errors: 3 },
  { time: '00:45', requests: 142, errors: 1 },
  { time: '01:00', requests: 165, errors: 2 }
];

export default function Analytics() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');

  const stats = [
    {
      title: 'Total API Calls',
      value: '2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Success Rate',
      value: '98.4%',
      change: '+0.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Avg Response Time',
      value: '235ms',
      change: '-15ms',
      trend: 'up',
      icon: Zap,
      color: 'text-purple-500'
    },
    {
      title: 'Monthly Cost',
      value: '$149.99',
      change: '+$23.50',
      trend: 'down',
      icon: DollarSign,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Monitor your API usage and performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  )}
                  {stat.change} from last period
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Calls Over Time</CardTitle>
                <CardDescription>Monthly API usage trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockApiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="hsl(var(--web3-primary))" 
                      fill="hsl(var(--web3-primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
                <CardDescription>API calls by blockchain network</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockNetworkData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockNetworkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Endpoints</CardTitle>
              <CardDescription>Most frequently used API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEndpointData.map((endpoint) => (
                  <div key={endpoint.endpoint} className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{endpoint.endpoint}</p>
                      <p className="text-xs text-muted-foreground">
                        {endpoint.calls.toLocaleString()} calls
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={endpoint.percentage} className="w-20" />
                      <span className="text-xs font-medium w-8">{endpoint.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average API response times</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockApiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="avgResponse" 
                      stroke="hsl(var(--web3-primary))" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Rate</CardTitle>
                <CardDescription>API success rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockApiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[95, 100]} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="success" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <CardDescription>Common error types and frequencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rate Limit Exceeded</p>
                    <p className="text-sm text-muted-foreground">HTTP 429</p>
                  </div>
                  <Badge variant="destructive">45 errors</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Invalid API Key</p>
                    <p className="text-sm text-muted-foreground">HTTP 401</p>
                  </div>
                  <Badge variant="destructive">23 errors</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Network Timeout</p>
                    <p className="text-sm text-muted-foreground">HTTP 500</p>
                  </div>
                  <Badge variant="destructive">12 errors</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>Detailed usage statistics by feature</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockEndpointData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="endpoint" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="hsl(var(--web3-primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Data Transfer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Upload</span>
                    <span className="text-sm font-medium">2.4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Download</span>
                    <span className="text-sm font-medium">15.7 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-sm font-bold">18.1 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">North America</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Europe</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Asia</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Peak</span>
                    <span className="text-sm font-medium">2:00 PM UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Weekly Peak</span>
                    <span className="text-sm font-medium">Tuesday</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max RPS</span>
                    <span className="text-sm font-medium">1,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  Live API Requests
                </CardTitle>
                <CardDescription>Real-time request monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockRealtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="hsl(var(--web3-primary))" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Gateway</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cache Layer</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Blockchain Nodes</span>
                    <Badge variant="secondary">Degraded</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
              <CardDescription>Current WebSocket connections and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-web3-primary">1,247</div>
                  <div className="text-sm text-muted-foreground">Active Connections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">98.7%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">156ms</div>
                  <div className="text-sm text-muted-foreground">Avg Latency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}