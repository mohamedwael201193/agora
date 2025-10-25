import { Layout } from "@/components/Layout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Architecture from "./pages/Architecture";
import Connect from "./pages/Connect";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Roadmap from "./pages/Roadmap";
import Counter from "./pages/demo/Counter";
import Transfer from "./pages/demo/Transfer";
import Confidence from "./pages/game/Confidence";

// Lazy-loaded routes for code-splitting
const ChronoEchoes = lazy(() => import("./pages/ChronoEchoes"));
const FoundryBuilder = lazy(() => import("./pages/FoundryBuilder"));
const MarketDetail = lazy(() => import("./pages/market/MarketDetail"));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-orange-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/connect" element={<Connect />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/:marketId" element={<MarketDetail />} />
              <Route path="/chrono-echoes" element={<ChronoEchoes />} />
              <Route path="/foundry" element={<FoundryBuilder />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/demo/counter" element={<Counter />} />
              <Route path="/demo/transfer" element={<Transfer />} />
              <Route path="/game/confidence" element={<Confidence />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
