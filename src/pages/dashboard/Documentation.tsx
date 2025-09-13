import { useState } from 'react';
import { Search, Book, Code, ExternalLink, Copy, Play, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const apiEndpoints = [
  {
    category: 'Authentication',
    endpoints: [
      {
        method: 'POST',
        path: '/auth/login',
        description: 'Authenticate user and get access token',
        params: ['email', 'password']
      },
      {
        method: 'POST', 
        path: '/auth/refresh',
        description: 'Refresh authentication token',
        params: ['refresh_token']
      }
    ]
  },
  {
    category: 'Blockchain',
    endpoints: [
      {
        method: 'GET',
        path: '/blockchain/:network/balance/:address',
        description: 'Get wallet balance for specific address',
        params: ['network', 'address']
      },
      {
        method: 'POST',
        path: '/blockchain/:network/transaction',
        description: 'Send transaction on blockchain',
        params: ['network', 'to', 'amount', 'private_key']
      },
      {
        method: 'GET',
        path: '/blockchain/:network/transaction/:hash',
        description: 'Get transaction details by hash',
        params: ['network', 'hash']
      }
    ]
  },
  {
    category: 'Smart Contracts',
    endpoints: [
      {
        method: 'POST',
        path: '/contracts/deploy',
        description: 'Deploy smart contract to blockchain',
        params: ['network', 'bytecode', 'abi', 'constructor_args']
      },
      {
        method: 'POST',
        path: '/contracts/:address/call',
        description: 'Call smart contract function',
        params: ['address', 'function', 'args', 'network']
      }
    ]
  }
];

const codeExamples = {
  javascript: {
    auth: `const response = await fetch('https://api.web3baas.com/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data.access_token);`,
    balance: `const balance = await fetch('https://api.web3baas.com/blockchain/ethereum/balance/0x123...', {
  headers: {
    'Authorization': 'Bearer ' + accessToken,
    'X-API-Key': 'your-api-key'
  }
});

const result = await balance.json();
console.log('Balance:', result.balance, 'ETH');`
  },
  python: {
    auth: `import requests

response = requests.post('https://api.web3baas.com/auth/login', 
  headers={
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  json={
    'email': 'user@example.com',
    'password': 'password123'
  }
)

data = response.json()
print(data['access_token'])`,
    balance: `import requests

response = requests.get('https://api.web3baas.com/blockchain/ethereum/balance/0x123...',
  headers={
    'Authorization': f'Bearer {access_token}',
    'X-API-Key': 'your-api-key'
  }
)

result = response.json()
print(f"Balance: {result['balance']} ETH")`
  },
  curl: {
    auth: `curl -X POST https://api.web3baas.com/auth/login \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'`,
    balance: `curl -X GET https://api.web3baas.com/blockchain/ethereum/balance/0x123... \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "X-API-Key: your-api-key"`
  }
};

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Authentication']));

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const filteredEndpoints = apiEndpoints.filter(category =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.endpoints.some(endpoint => 
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">Documentation</h1>
          <p className="text-muted-foreground mt-2">
            Complete API reference and integration guides
          </p>
        </div>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          Full Docs
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="curl">cURL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="api-reference" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-reference">API Reference</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
        </TabsList>

        <TabsContent value="api-reference" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Base URL</h4>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      https://api.web3baas.com
                    </code>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Include your API key in the X-API-Key header
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Rate Limits</h4>
                    <p className="text-sm text-muted-foreground">
                      1000 requests per minute
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
{`{
  "success": true,
  "data": {...},
  "error": null,
  "timestamp": "2024-01-01T00:00:00Z"
}`}
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {filteredEndpoints.map((category) => (
                <Card key={category.category}>
                  <Collapsible 
                    open={openSections.has(category.category)}
                    onOpenChange={() => toggleSection(category.category)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{category.category}</CardTitle>
                          {openSections.has(category.category) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        {category.endpoints.map((endpoint) => (
                          <div key={endpoint.path} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge 
                                variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm">{endpoint.path}</code>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {endpoint.description}
                            </p>
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Parameters:</h5>
                              <div className="flex flex-wrap gap-1">
                                {endpoint.params.map((param) => (
                                  <Badge key={param} variant="outline" className="text-xs">
                                    {param}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button variant="outline" size="sm">
                                <Play className="w-3 h-3 mr-1" />
                                Try it
                              </Button>
                              <Button variant="outline" size="sm">
                                <Code className="w-3 h-3 mr-1" />
                                Example
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Basic setup and authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. Get Your API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate an API key from your dashboard
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2. Make Your First Request</h4>
                    <p className="text-sm text-muted-foreground">
                      Test the connection with a simple balance check
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3. Handle Responses</h4>
                    <p className="text-sm text-muted-foreground">
                      Parse JSON responses and handle errors properly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Integration</CardTitle>
                <CardDescription>Deploy and interact with contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. Prepare Your Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      Compile Solidity code and get bytecode
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2. Deploy Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the deployment endpoint with proper parameters
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3. Interact with Functions</h4>
                    <p className="text-sm text-muted-foreground">
                      Call contract functions and listen for events
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Handling</CardTitle>
                <CardDescription>Handle API errors gracefully</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">HTTP Status Codes</h4>
                    <div className="space-y-1 text-sm">
                      <div><code>200</code> - Success</div>
                      <div><code>400</code> - Bad Request</div>
                      <div><code>401</code> - Unauthorized</div>
                      <div><code>429</code> - Rate Limited</div>
                      <div><code>500</code> - Server Error</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Tips for optimal integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Rate Limiting</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement exponential backoff for retries
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Keep API keys secure and use HTTPS only
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Caching</h4>
                    <p className="text-sm text-muted-foreground">
                      Cache responses when appropriate to reduce costs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Authentication Example</CardTitle>
                    <CardDescription>Login and get access token</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].auth)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedLanguage as keyof typeof codeExamples].auth}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Balance Check Example</CardTitle>
                    <CardDescription>Get wallet balance for an address</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].balance)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedLanguage as keyof typeof codeExamples].balance}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sdks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>JavaScript SDK</CardTitle>
                    <CardDescription>npm package</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Installation:</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      npm install web3baas-sdk
                    </code>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Book className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Python SDK</CardTitle>
                    <CardDescription>pip package</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Installation:</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      pip install web3baas
                    </code>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Book className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Go SDK</CardTitle>
                    <CardDescription>go module</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Installation:</p>
                    <code className="text-xs bg-muted px-2 py-1 rounded block">
                      go get github.com/web3baas/go-sdk
                    </code>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Book className="w-4 h-4 mr-2" />
                    View Docs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Community SDKs</CardTitle>
              <CardDescription>Community-maintained libraries and tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">React Hooks</p>
                    <p className="text-sm text-muted-foreground">useWeb3BaaS hook collection</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">PHP SDK</p>
                    <p className="text-sm text-muted-foreground">Composer package</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}