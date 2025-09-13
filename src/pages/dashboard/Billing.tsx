import { useState } from 'react';
import { CreditCard, Download, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

const plans = [
  {
    name: 'Developer',
    price: 0,
    period: 'month',
    features: [
      '10,000 API calls/month',
      'Basic blockchain networks',
      'Email support',
      'Standard rate limits'
    ],
    current: true
  },
  {
    name: 'Professional',
    price: 49,
    period: 'month',
    features: [
      '100,000 API calls/month',
      'All blockchain networks',
      'Priority support',
      'Advanced analytics',
      'Custom webhooks'
    ],
    current: false
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    features: [
      '1,000,000 API calls/month',
      'Dedicated infrastructure',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantees'
    ],
    current: false
  }
];

const invoices = [
  {
    id: 'INV-2024-001',
    date: '2024-01-01',
    amount: 49.00,
    status: 'paid',
    plan: 'Professional'
  },
  {
    id: 'INV-2023-012',
    date: '2023-12-01',
    amount: 49.00,
    status: 'paid',
    plan: 'Professional'
  },
  {
    id: 'INV-2023-011',
    date: '2023-11-01',
    amount: 49.00,
    status: 'paid',
    plan: 'Professional'
  },
  {
    id: 'INV-2023-010',
    date: '2023-10-01',
    amount: 49.00,
    status: 'failed',
    plan: 'Professional'
  }
];

const usageData = [
  { service: 'API Calls', used: 25000, limit: 100000, cost: 0.001 },
  { service: 'Contract Deployments', used: 15, limit: 50, cost: 0.05 },
  { service: 'Data Storage', used: 2.1, limit: 10, cost: 0.02 },
  { service: 'Bandwidth', used: 45.5, limit: 100, cost: 0.01 }
];

export default function Billing() {
  const { profile } = useAuth();
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const currentUsage = 25000;
  const usageLimit = 100000;
  const usagePercentage = (currentUsage / usageLimit) * 100;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">Billing & Usage</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and monitor usage
          </p>
        </div>
        <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-web3-primary hover:bg-web3-primary/80">
              <TrendingUp className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Choose Your Plan</DialogTitle>
              <DialogDescription>
                Select the plan that best fits your needs
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`cursor-pointer transition-colors ${
                    plan.current ? 'ring-2 ring-web3-primary' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.current && <Badge>Current</Badge>}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{profile?.tier || 'Developer'}</span>
                <Badge>{profile?.tier === 'developer' ? 'Free' : 'Paid'}</Badge>
              </div>
              <p className="text-2xl font-bold">
                ${profile?.tier === 'professional' ? '49' : profile?.tier === 'enterprise' ? '199' : '0'}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Calls</span>
                <span className="font-medium">{currentUsage.toLocaleString()} / {usageLimit.toLocaleString()}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {usagePercentage.toFixed(1)}% of monthly limit used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{profile?.credits?.toLocaleString() || '1,000'}</p>
              <p className="text-sm text-muted-foreground">
                Resets monthly
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Buy More Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="usage">Usage Details</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Breakdown</CardTitle>
              <CardDescription>
                Detailed usage statistics for current billing period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {usageData.map((item) => (
                  <div key={item.service} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.service}</span>
                      <span className="text-sm text-muted-foreground">
                        ${(item.used * item.cost).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {item.service === 'Data Storage' || item.service === 'Bandwidth' 
                          ? `${item.used} GB / ${item.limit} GB`
                          : `${item.used.toLocaleString()} / ${item.limit.toLocaleString()}`
                        }
                      </span>
                      <span className="text-muted-foreground">
                        ${item.cost.toFixed(3)} per {item.service === 'API Calls' ? 'call' : 
                          item.service === 'Contract Deployments' ? 'deployment' : 'GB'}
                      </span>
                    </div>
                    <Progress 
                      value={(item.used / item.limit) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between text-lg font-medium">
                <span>Total Usage Cost</span>
                <span>$32.50</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Alerts</CardTitle>
              <CardDescription>
                Set up notifications when approaching limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium">Usage Warning</p>
                    <p className="text-sm text-muted-foreground">
                      You've used 75% of your monthly API calls
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Acknowledge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>
                    Download and manage your billing invoices
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono">{invoice.id}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.plan}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8" />
                    <div>
                      <p className="font-medium">**** **** **** 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>Default</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>

              <Separator />

              <div>
                <h4 className="font-medium mb-4">Billing Information</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="billingName">Full Name</Label>
                    <Input id="billingName" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="billingEmail">Email</Label>
                    <Input id="billingEmail" type="email" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="billingAddress">Address</Label>
                    <Input id="billingAddress" defaultValue="123 Main St" />
                  </div>
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input id="billingCity" defaultValue="San Francisco" />
                  </div>
                  <div>
                    <Label htmlFor="billingState">State</Label>
                    <Select defaultValue="CA">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="billingZip">ZIP Code</Label>
                    <Input id="billingZip" defaultValue="94105" />
                  </div>
                </div>
                <Button className="mt-4">
                  Save Billing Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}