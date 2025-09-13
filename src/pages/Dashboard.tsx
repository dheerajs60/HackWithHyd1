import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Activity, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { NetworkStatus } from '@/components/dashboard/NetworkStatus';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    networks: []
  });
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    projectId: '',
    permissions: []
  });

  const fetchProjects = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive"
      });
      return;
    }

    setProjects(data || []);
  };

  const fetchApiKeys = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('api_keys')
      .select('*, projects(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive"
      });
      return;
    }

    setApiKeys(data || []);
  };

  useEffect(() => {
    if (!user) return;
    fetchProjects();
    fetchApiKeys();
  }, [user]);

  const createProject = async () => {
    setIsCreatingProject(true);
    
    const { error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: newProject.name,
        description: newProject.description,
        networks: newProject.networks
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Project created successfully"
      });
      setNewProject({ name: '', description: '', networks: [] });
      fetchProjects();
    }

    setIsCreatingProject(false);
  };

  const generateApiKey = async () => {
    setIsCreatingKey(true);
    
    // Generate a secure API key
    const keyData = crypto.getRandomValues(new Uint8Array(32));
    const key = `wb3_${Array.from(keyData, byte => byte.toString(16).padStart(2, '0')).join('')}`;
    const keyPrefix = key.substring(0, 12) + '...';
    
    const { error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        project_id: newApiKey.projectId || null,
        name: newApiKey.name,
        key_hash: key, // In production, this should be hashed
        key_prefix: keyPrefix,
        permissions: newApiKey.permissions
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive"
      });
    } else {
      toast({
        title: "API Key Created",
        description: "Make sure to copy your API key - you won't be able to see it again!"
      });
      setNewApiKey({ name: '', projectId: '', permissions: [] });
      fetchApiKeys();
    }

    setIsCreatingKey(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard"
    });
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  return (
    <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <StatsCards profile={profile} projects={projects} apiKeys={apiKeys} />

          {/* Quick Actions & Network Status */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <NetworkStatus />
          </div>

          {/* Recent Activity */}
          <RecentActivity />

          {/* Legacy Content - Projects & API Keys Management */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="apikeys">API Keys</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Projects</h2>
                <Button onClick={() => setIsCreatingProject(!isCreatingProject)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              {isCreatingProject && (
                <Card className="gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                    <CardDescription>Set up a new Web3 project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="My Web3 App"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe your project..."
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={createProject} disabled={!newProject.name}>
                        Create Project
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {projects.map((project: any) => (
                  <Card key={project.id} className="gradient-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <p className="text-muted-foreground">{project.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={project.is_active ? "default" : "secondary"}>
                          {project.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="apikeys" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Keys</h2>
                <Button onClick={() => setIsCreatingKey(!isCreatingKey)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Key
                </Button>
              </div>

              {isCreatingKey && (
                <Card className="gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle>Generate API Key</CardTitle>
                    <CardDescription>Create a new API key for your projects</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="key-name">Key Name</Label>
                      <Input
                        id="key-name"
                        placeholder="Production API Key"
                        value={newApiKey.name}
                        onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="key-project">Project (Optional)</Label>
                      <Select onValueChange={(value) => setNewApiKey({ ...newApiKey, projectId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project: any) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={generateApiKey} disabled={!newApiKey.name}>
                        Generate Key
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreatingKey(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-4">
                {apiKeys.map((apiKey: any) => (
                  <Card key={apiKey.id} className="gradient-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{apiKey.name}</h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <code className="text-sm bg-background/50 px-2 py-1 rounded">
                              {showKeys[apiKey.id] ? apiKey.key_hash : apiKey.key_prefix}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(apiKey.key_hash)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Used {apiKey.usage_count} times • Created {new Date(apiKey.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                          {apiKey.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
              <Card className="gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Real-time analytics and insights will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  );
};

export default Dashboard;
