import { useState, useEffect } from 'react';
import { Plus, Copy, Eye, EyeOff, Trash2, QrCode, Key, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  permissions: string[];
  usage_count: number;
  rate_limit_per_minute: number;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

const PERMISSIONS = [
  { id: 'read', label: 'Read Access', description: 'View blockchain data and analytics' },
  { id: 'write', label: 'Write Access', description: 'Send transactions and interact with contracts' },
  { id: 'deploy', label: 'Deploy Contracts', description: 'Deploy smart contracts to networks' },
  { id: 'admin', label: 'Admin Access', description: 'Full access to all features' }
];

export default function ApiKeys() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000
  });

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const prefix = 'wk_';
    const randomPart = Array.from({ length: 32 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
    return prefix + randomPart;
  };

  const createApiKey = async () => {
    try {
      const fullApiKey = generateApiKey();
      const keyPrefix = fullApiKey.substring(0, 8) + '...';
      
      const { error } = await supabase
        .from('api_keys')
        .insert([{
          name: newApiKey.name,
          key_hash: fullApiKey, // In production, this should be hashed
          key_prefix: keyPrefix,
          permissions: newApiKey.permissions,
          rate_limit_per_minute: newApiKey.rateLimit,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      // Show the full key once
      navigator.clipboard.writeText(fullApiKey);
      toast.success('API key created and copied to clipboard!');
      
      setIsCreateDialogOpen(false);
      setNewApiKey({ name: '', permissions: [], rateLimit: 1000 });
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to create API key');
    }
  };

  const toggleApiKey = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);

      if (error) throw error;
      
      toast.success(`API key ${!currentStatus ? 'enabled' : 'disabled'}`);
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to update API key');
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      
      toast.success('API key deleted successfully');
      fetchApiKeys();
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">API Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys and access permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-web3-primary hover:bg-web3-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with custom permissions and rate limits
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Production API Key"
                />
              </div>
              <div>
                <Label htmlFor="rateLimit">Rate Limit (per minute)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={newApiKey.rateLimit}
                  onChange={(e) => setNewApiKey(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="space-y-3 mt-2">
                  {PERMISSIONS.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={newApiKey.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewApiKey(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission.id]
                            }));
                          } else {
                            setNewApiKey(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission.id)
                            }));
                          }
                        }}
                      />
                      <div>
                        <Label htmlFor={permission.id} className="text-sm font-medium">
                          {permission.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={createApiKey} className="w-full">
                Generate API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Key className="w-5 h-5 text-web3-primary" />
                  <div>
                    <CardTitle className="text-lg">{apiKey.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(apiKey.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                    {apiKey.is_active ? 'Active' : 'Disabled'}
                  </Badge>
                  <Switch
                    checked={apiKey.is_active}
                    onCheckedChange={() => toggleApiKey(apiKey.id, apiKey.is_active)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>API Key</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      readOnly
                      value={visibleKeys.has(apiKey.id) ? apiKey.key_hash : apiKey.key_prefix}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(apiKey.key_hash)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Usage Statistics</Label>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Calls:</span>
                      <span className="font-medium">{apiKey.usage_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Rate Limit:</span>
                      <span className="font-medium">{apiKey.rate_limit_per_minute}/min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Last Used:</span>
                      <span className="font-medium">
                        {apiKey.last_used_at 
                          ? new Date(apiKey.last_used_at).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {apiKey.permissions?.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {PERMISSIONS.find(p => p.id === permission)?.label || permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this API key? This action cannot be undone
                        and will immediately revoke access for any applications using this key.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteApiKey(apiKey.id)}>
                        Delete Key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {apiKeys.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No API keys yet</h3>
          <p className="text-muted-foreground mt-1">
            Generate your first API key to start building
          </p>
        </div>
      )}
    </div>
  );
}