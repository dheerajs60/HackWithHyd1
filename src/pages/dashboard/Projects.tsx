import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Settings, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  description: string;
  networks: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BLOCKCHAIN_NETWORKS = [
  'Ethereum', 'Polygon', 'BSC', 'Avalanche', 'Arbitrum', 'Optimism', 'Fantom', 'Solana'
];

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    networks: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...newProject,
          user_id: user?.id
        }]);

      if (error) throw error;
      
      toast.success('Project created successfully');
      setIsCreateDialogOpen(false);
      setNewProject({ name: '', description: '', networks: [] });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const toggleProjectStatus = async (projectId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_active: !currentStatus })
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success(`Project ${!currentStatus ? 'activated' : 'paused'}`);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update project status');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold web3-text-gradient">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blockchain projects and configurations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-web3-primary hover:bg-web3-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new blockchain project with your preferred networks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My DeFi Project"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A decentralized finance application..."
                />
              </div>
              <div>
                <Label>Blockchain Networks</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {BLOCKCHAIN_NETWORKS.map((network) => (
                    <div key={network} className="flex items-center space-x-2">
                      <Checkbox
                        id={network}
                        checked={newProject.networks.includes(network)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewProject(prev => ({
                              ...prev,
                              networks: [...prev.networks, network]
                            }));
                          } else {
                            setNewProject(prev => ({
                              ...prev,
                              networks: prev.networks.filter(n => n !== network)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={network} className="text-sm">{network}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={createProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={project.is_active ? "default" : "secondary"}>
                    {project.is_active ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleProjectStatus(project.id, project.is_active)}>
                      {project.is_active ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {project.description || 'No description provided'}
              </CardDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">Networks:</p>
                <div className="flex flex-wrap gap-1">
                  {project.networks?.map((network) => (
                    <Badge key={network} variant="outline" className="text-xs">
                      {network}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Created {new Date(project.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1">
            Get started by creating your first project
          </p>
        </div>
      )}
    </div>
  );
}