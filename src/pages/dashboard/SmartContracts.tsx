import { useState, useEffect } from 'react';
import { Plus, Code, ExternalLink, Copy, Download, Play, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SmartContract {
  id: string;
  name: string;
  contract_type: string;
  contract_address: string | null;
  network_name: string;
  chain_id: number;
  status: 'deploying' | 'deployed' | 'failed' | 'verified';
  deployment_tx_hash: string | null;
  gas_used: number | null;
  deployment_cost: string | null;
  is_verified: boolean;
  abi: any;
  bytecode: string | null;
  source_code: string | null;
  compiler_version: string | null;
  created_at: string;
}

const BLOCKCHAIN_NETWORKS = [
  { name: 'Ethereum', chainId: 1 },
  { name: 'Polygon', chainId: 137 },
  { name: 'BSC', chainId: 56 },
  { name: 'Avalanche', chainId: 43114 },
  { name: 'Arbitrum', chainId: 42161 },
  { name: 'Optimism', chainId: 10 }
];

const CONTRACT_TEMPLATES = [
  {
    type: 'ERC20',
    name: 'ERC-20 Token',
    description: 'Standard fungible token contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`
  },
  {
    type: 'ERC721',
    name: 'NFT Collection',
    description: 'Non-fungible token contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _mint(to, tokenId);
        return tokenId;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}`
  }
];

export default function SmartContracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [deploymentForm, setDeploymentForm] = useState({
    name: '',
    network: '',
    contractType: '',
    sourceCode: '',
    compilerVersion: '0.8.19'
  });

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('smart_contracts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      toast.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  const deployContract = async () => {
    try {
      const network = BLOCKCHAIN_NETWORKS.find(n => n.name === deploymentForm.network);
      if (!network) throw new Error('Invalid network selected');

      const { error } = await supabase
        .from('smart_contracts')
        .insert([{
          name: deploymentForm.name,
          contract_type: deploymentForm.contractType,
          network_name: deploymentForm.network,
          chain_id: network.chainId,
          source_code: deploymentForm.sourceCode,
          compiler_version: deploymentForm.compilerVersion,
          status: 'deploying',
          user_id: user?.id
        }]);

      if (error) throw error;
      
      toast.success('Contract deployment initiated');
      setIsDeployDialogOpen(false);
      setDeploymentForm({
        name: '',
        network: '',
        contractType: '',
        sourceCode: '',
        compilerVersion: '0.8.19'
      });
      fetchContracts();
    } catch (error) {
      toast.error('Failed to deploy contract');
    }
  };

  const selectTemplate = (template: any) => {
    setSelectedTemplate(template.type);
    setDeploymentForm(prev => ({
      ...prev,
      contractType: template.type,
      sourceCode: template.code
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadABI = (contract: SmartContract) => {
    const blob = new Blob([JSON.stringify(contract.abi, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.name}_abi.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">Smart Contracts</h1>
          <p className="text-muted-foreground mt-2">
            Deploy and manage smart contracts across multiple blockchains
          </p>
        </div>
        <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-web3-primary hover:bg-web3-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Deploy Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Deploy Smart Contract</DialogTitle>
              <DialogDescription>
                Choose a template or upload your own contract code
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="custom">Custom Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {CONTRACT_TEMPLATES.map((template) => (
                    <Card
                      key={template.type}
                      className={`cursor-pointer transition-colors ${
                        selectedTemplate === template.type ? 'ring-2 ring-web3-primary' : ''
                      }`}
                      onClick={() => selectTemplate(template)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline">{template.type}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div>
                  <Label htmlFor="sourceCode">Source Code</Label>
                  <Textarea
                    id="sourceCode"
                    value={deploymentForm.sourceCode}
                    onChange={(e) => setDeploymentForm(prev => ({ ...prev, sourceCode: e.target.value }))}
                    placeholder="Paste your Solidity code here..."
                    className="min-h-[300px] font-mono"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contractName">Contract Name</Label>
                <Input
                  id="contractName"
                  value={deploymentForm.name}
                  onChange={(e) => setDeploymentForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Smart Contract"
                />
              </div>
              <div>
                <Label htmlFor="network">Blockchain Network</Label>
                <Select
                  value={deploymentForm.network}
                  onValueChange={(value) => setDeploymentForm(prev => ({ ...prev, network: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOCKCHAIN_NETWORKS.map((network) => (
                      <SelectItem key={network.name} value={network.name}>
                        {network.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contractType">Contract Type</Label>
                <Input
                  id="contractType"
                  value={deploymentForm.contractType}
                  onChange={(e) => setDeploymentForm(prev => ({ ...prev, contractType: e.target.value }))}
                  placeholder="ERC20, ERC721, etc."
                />
              </div>
              <div>
                <Label htmlFor="compilerVersion">Compiler Version</Label>
                <Select
                  value={deploymentForm.compilerVersion}
                  onValueChange={(value) => setDeploymentForm(prev => ({ ...prev, compilerVersion: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8.19">0.8.19</SelectItem>
                    <SelectItem value="0.8.18">0.8.18</SelectItem>
                    <SelectItem value="0.8.17">0.8.17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={deployContract} className="w-full">
              Deploy Contract
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {contracts.map((contract) => (
          <Card key={contract.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{contract.name}</CardTitle>
                  <CardDescription>
                    {contract.contract_type} on {contract.network_name}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      contract.status === 'deployed' ? 'default' :
                      contract.status === 'failed' ? 'destructive' : 'secondary'
                    }
                  >
                    {contract.status}
                  </Badge>
                  {contract.is_verified && (
                    <Badge variant="outline">Verified</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contract.contract_address && (
                  <div>
                    <Label>Contract Address</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        readOnly
                        value={contract.contract_address}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(contract.contract_address!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(`https://etherscan.io/address/${contract.contract_address}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {contract.deployment_tx_hash && (
                  <div>
                    <Label>Deployment Tx</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        readOnly
                        value={`${contract.deployment_tx_hash.substring(0, 10)}...`}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(contract.deployment_tx_hash!)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Network</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{contract.network_name}</Badge>
                  </div>
                </div>

                {contract.gas_used && (
                  <div>
                    <Label>Gas Used</Label>
                    <p className="text-sm font-medium mt-1">
                      {contract.gas_used.toLocaleString()}
                    </p>
                  </div>
                )}

                {contract.deployment_cost && (
                  <div>
                    <Label>Deployment Cost</Label>
                    <p className="text-sm font-medium mt-1">
                      {contract.deployment_cost} ETH
                    </p>
                  </div>
                )}

                <div>
                  <Label>Compiler Version</Label>
                  <p className="text-sm font-medium mt-1">
                    {contract.compiler_version || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-6 pt-4 border-t">
                {contract.abi && (
                  <Button variant="outline" size="sm" onClick={() => downloadABI(contract)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download ABI
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Code className="w-4 h-4 mr-2" />
                  View Source
                </Button>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Interact
                </Button>
                <Button variant="outline" size="sm">
                  <FileCode className="w-4 h-4 mr-2" />
                  Verify Contract
                </Button>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">
                Deployed {new Date(contract.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No contracts deployed yet</h3>
          <p className="text-muted-foreground mt-1">
            Deploy your first smart contract to get started
          </p>
        </div>
      )}
    </div>
  );
}