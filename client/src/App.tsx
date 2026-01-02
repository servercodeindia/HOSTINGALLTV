import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found.tsx";
import Home from "@/pages/Home.tsx";
import MoviesPage from "@/pages/Movies.tsx";
import SeriesPage from "@/pages/Series.tsx";
import SearchPage from "@/pages/Search.tsx";
import AdminDashboard from "@/pages/admin/Dashboard.tsx";
import AdminMovies from "@/pages/admin/Movies.tsx";
import AdminSeries from "@/pages/admin/Series.tsx";

function Router() {
  return (
    <Switch>
      {/* User Routes */}
      <Route path="/" component={Home} />
      <Route path="/movies" component={MoviesPage} />
      <Route path="/series" component={SeriesPage} />
      <Route path="/search" component={SearchPage} />

      {/* Admin Routes */}
      <Route path="/server/admin" component={AdminDashboard} />
      <Route path="/server/admin/movies" component={AdminMovies} />
      <Route path="/server/admin/series" component={AdminSeries} />

      <Route path="/server" component={() => {
        window.location.href = "/server/admin";
        return null;
      }} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
