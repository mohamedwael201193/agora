import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Connect from "./pages/Connect";
import Marketplace from "./pages/Marketplace";
import ChronoEchoes from "./pages/ChronoEchoes";
import FoundryBuilder from "./pages/FoundryBuilder";
import Architecture from "./pages/Architecture";
import Roadmap from "./pages/Roadmap";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/chrono-echoes" element={<ChronoEchoes />} />
            <Route path="/foundry" element={<FoundryBuilder />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
