import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/dashboard/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/dashboard/Projects";
import ApiKeys from "./pages/dashboard/ApiKeys";
import SmartContracts from "./pages/dashboard/SmartContracts";
import Analytics from "./pages/dashboard/Analytics";
import Documentation from "./pages/dashboard/Documentation";
import Settings from "./pages/dashboard/Settings";
import Storage from "./pages/dashboard/Storage";
import Billing from "./pages/dashboard/Billing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="contracts" element={<SmartContracts />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="docs" element={<Documentation />} />
              <Route path="storage" element={<Storage />} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
