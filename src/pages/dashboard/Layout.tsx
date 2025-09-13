import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'enterprise': return 'bg-web3-accent text-background';
    case 'professional': return 'bg-web3-primary text-background';
    default: return 'bg-web3-success text-background';
  }
};

export default function DashboardLayout() {
  const { user, profile, signOut, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-web3-bg flex items-center justify-center">
        <div className="animate-pulse text-web3-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-web3-bg flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold web3-text-gradient">Dashboard</h1>
                <Badge className={getTierColor(profile?.tier || 'developer')}>
                  {profile?.tier || 'Developer'}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <p className="font-medium">{profile?.full_name || user.email}</p>
                </div>
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
